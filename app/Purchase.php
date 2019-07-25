<?php

namespace App;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\PurchasedElement;
use Ginger;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{

  use SoftDeletes;


  /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'Purchases';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ['externalPaid', 'entity_id', 'association', 'login', 'address_id', 'semester_id'];

  /**
  *   Retourne l'entité
  *
  */
  public function entity()
  {
      return $this->belongsTo(Entity::class);
  }

  /**
   * @inheritedDoc
   */
  protected $dates = [
      'datePaid',
      'externalPaid',
      'created_at',
      'deleted_at'
  ];

  /**
   * Rules pour Validator
   *
   * @var array
   */
  public static $rules = [
    'entity_id' => 'required|exists:Entity,id',
  ];


  /**
   * Attributs rajoutés
   *
   * @var array
   */
  protected $appends = ['number', 'user', 'paid', 'datePaid', 'address', 'elements', 'lastVersionElements', 'isCompleted', 'status', 'statusName', 'statusMax', 'totalPrice', 'totalPriceInt', 'isTotalPriceDefined', 'isServicePurchase'];


  /**
  *   Mise à jour de la commande si terminée
  */
  static public function softDeletePurchase($id)
  {
      $p = Purchase::findOrFail($id);
      if ($p->isCompleted) {
          $p->delete();
      }   
  }


  /**
  *   Sort tous les commandes de l'historique
  */
  static public function getHistoryIndex($semester_id)
  {
      
      $data = Purchase::onlyTrashed()
        ->where([
          ['semester_id', $semester_id]
        ])
        ->with(['elements', 'transactions', 'address', 'entity'])->get();
      // dd($data);

      return $data;  
  }

  /**
   * On crée un attribut pour le numéro de facture: FA-18SA0007 par ex.
   * 
   */
  public function getNumberAttribute() {
    $year = $this->created_at->year;
    
    $initials = substr($this->login, 0, 1) . substr($this->login, 7, 1);
    
    $entity = $this->entity ? $this->entity->abreviation : "XX";

    return strtoupper($entity . '-' . substr($year,2) . $initials . sprintf('%04d',$this->id));
  }

  /**
   * Retourne le client
   *
   */
  // public function user()
  // {
  //     return $this->belongsTo(User::class, 'login');
  // }

  /**
   * On crée un attribut pour l'acheteur
   *
   */
  public function getUserAttribute() 
  {
    $response = Ginger::getUser($this->login);
    if ($response->status == 200) {
      return $response->content;
    } else {
      return null;
    }
  }

  /**
   * Retourne les transactions faites
   *
   */
  public function transactions()
  {
      return $this->hasMany(Transaction::class);
  }

  /**
   * Attribut contenant l'information: Purchase payée ou non
   *
   */
  public function getPaidAttribute() {
    if($this->externalPaid)
      return true;
    else {
      return $this->transactions->where('paid', true)->first() ? true : false;
    }
  }

  /**
   * Attribut contenant l'information: date de paiement
   *
   */
  public function getDatePaidAttribute() {
    if(!$this->paid) return NULL;

    // Si elle a été payé:
    // Soit par un moyen externe (la date est externalPaid)
    // Soit par Payutc
    if($this->externalPaid) {
        return $this->externalPaid->toAtomString();
    } else {
      return $this->transactions->where('paid', true)->first()->created_at->toAtomString();
    }
  }

  /**
   * Retourne l'adresse de la facture
   *
   */
  public function address()
  {
      return $this->belongsTo(Address::class, 'address_id');
  }

  /**
   * Attribut contenant l'adresse'
   *
   */
  public function getAddressAttribute() {
    if($address = $this->address())
      return $address->first();
    else
      return null;
  }

  /**
   * Retourne les PurchasedElement de la Purchase actuelle
   *
   */
  public function elements()
  {
      return $this->hasMany(PurchasedElement::class);
  }

  /**
   * On crée un attribut pour les elements
   *
   */
  public function getElementsAttribute() {
    return $this->elements()->withTrashed()->get();
  }

  /**
   * Retourne les PurchasedElement de type Service
   *
   */
  public function getLastVersionServices()
  {
    $elements = $this->elements;
    $filtered = $elements->filter(function($item, $key){
      return $item->isService();
    });
    $lastVersion = [];
    foreach ($filtered as $element) {
      $found = false;
      $rank = 0;
      foreach ($lastVersion as $versionKey => $version) {
        if($version["id"] == $element["id"]) {
          if($version["version"] < $element["version"]){
            unset($lastVersion[$versionKey]);
            array_push($lastVersion, $element);
          }
          $found = true;
        }
      }
      if ($found == false) {
        array_push($lastVersion, $element);
      }
      $rank += 1;
    }
    return $lastVersion;
  }

  /**
   * Retourne les PurchasedElement de type Product
   *
   */
  public function getProducts()
  {
    $elements = $this->elements;
    $filtered = $elements->filter(function($item, $key){
      return $item->isProduct();
    });
    return $filtered->all();
  }

  /**
  *   Obtenir la dernière version de chaque élément
  */
  public function getlastVersionElementsAttribute(){

    $services = $this->getLastVersionServices();
    $products = $this->getProducts();

    return array_merge($services, $products);

  }

  /**
  *   Déterminer si une commande est terminée (annulée, ou réalisée et payée)
  */
  public function getIsCompletedAttribute() {
    if (($this->getPaidAttribute() && $this->status >= 3) || $this->status >= 4) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *   Obtenir le statut d'une commande
  */
  public function getStatusAttribute(){
    $status = 5;
    foreach ($this->lastVersionElements as $element) {
      if ($element["status"] < $status) {
        $status = $element["status"];
      }
    }
    return $status;
  }

  /**
  *   Obtenir le nom du statut d'une commande
  */
  public function getStatusNameAttribute(){
    $status = 5;
    foreach ($this->lastVersionElements as $element) {
      if ($element["status"] < $status) {
        $status = $element["status"];
      }
    }
    switch ($status) {
      case 5:
        $statusName = "Annulée";
        break;
      case 4:
        $statusName = "Annulée";
        break;
      case 3:
        $statusName = "Réalisée";
        break;
      case 2:
        $statusName = "Validée (Client)";
        break;
      case 1:
        $statusName = "Validée (Fablab)";
        break;
      case 0:
        $statusName = "Demande envoyée";
        break;
      
      default:
        $statusName = "";
        break;
    }
    return $statusName;
  }

  /**
  *   Obtenir le plus haut statut de la commande
  *
  */
  public function getStatusMaxAttribute(){
    $statusMax = 0;
    foreach ($this->lastVersionElements as $element) {
      if ($element["status"] > $statusMax){
        $statusMax = $element["status"];
      }
    }
    return $statusMax;
  }

  /**
   * Attribut contenant la somme finale de ce qu'il y a à payer
   *
   */
  public function getTotalPriceAttribute() {
    $totalPrice = 0;
    foreach ($this->lastVersionElements as $elementKey => $elementValue) {
      // Note : null == 0 mais null !== 0 car pas de même type
      if ($elementValue["finalPrice"] === null) {
        return "A déterminer";
      } else {
        $totalPrice += $elementValue["finalPrice"];
      }
    }
    return number_format($totalPrice, 2)." €";
  }


  /**
  *   Attribut servant à savoir le prix total de la commande est défini
  *
  */
  public function getIsTotalPriceDefinedAttribute(){
    if ($this->totalPrice == "A déterminer"){
      return false;
    } else {
      return true;
    }
  }

  /**
   * Attribut contenant la somme finale en integer de ce qu'il y a à payer
   *
   */
  public function getTotalPriceIntAttribute() {
    $totalPriceInt = 0;
    if ($this->getIsTotalPriceDefinedAttribute()) {
      foreach ($this->lastVersionElements as $elementKey => $elementValue) {
        $totalPriceInt += $elementValue["finalPrice"];
      }
    }

    return (number_format($totalPriceInt, 2));
  }

  /**
  *   Renvoie prix des services pour les devis et factures
  *
  */
  public function getTotalServices(){
      $price = 0;
      foreach ($this->getLastActiveVersionServices() as $service) {
        $price += $service["finalPrice"];
      }
      return $price;
  }


  /**
  *   Renvoie le prix des produits pour les devis et factures
  */
  public function getTotalProducts(){
      $price = 0;
      foreach ($this->getProducts() as $product) {
        $price += $product["finalPrice"];
      }
      return $price;
  }


  /**
  *   Renvoie les services non annulés pour les devis et factures
  */
  public function getLastActiveVersionServices(){
    $activeServices = [];

    foreach ($this->getLastVersionServices() as $service) {
      if($service["status"] >= 1 && $service["status"] <= 3){
        array_push($activeServices, $service);
      }
    }
    return $activeServices;
  }

  /**
  *   Renvoie les produits non annulés pour les devis et les factures
  */
  public function getActiveProducts(){
    $activeProducts = [];

    foreach ($this->getProducts() as $product) {
      if ($product["status"] >= 1 && $product["status"] <= 3) {
        array_push($activeProducts, $product);
      }
    }

    return $activeProducts;
  }
  

  /**
  *   Renvoie si la purchase est constitué uniquement de service ou non
  */
  public function getIsServicePurchaseAttribute(){
    $products = $this->getProducts();

    if ($products) {
      return false;
    }
    return true;
  }

}
