<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class PurchasedElement extends Model
{

  use SoftDeletes;


  protected $dates = [
    'deleted_at'
  ];

  /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'PurchasedElements';

  /**
   * Rules pour Validator
   *
   * @var array
   */
  public static $rules = [
    'purchasable_type' => 'required|in:service,product',
  ];

  /**
   * The attributes that should be casted to native types.
   *
   * @var array
   */
  protected $casts = [
      'args' => 'array',
  ];

  /**
  *   Mise à jour d'un élément s'il a été réalisé
  */
  static public function softDeletePurchasedElement($id, $status)
  {
    if ($status >= 3) {
      $pe = PurchasedElement::where('id', $id)->get();
      // On supprime chaque version de l'élément
      foreach ($pe as $e) {
          $e->delete();
      }
    }
        
      
  }

  /**
   * Retourne le Product ou Service associé
   */
  public function purchasable()
  {
      return $this->morphTo()->withTrashed();
  }

  /**
   * Retourne le Purchase associé
   */
  public function purchase()
  {
      return $this->belongsTo('App\Purchase');
  }

  /**
   * Indique si c'est un Service
   */
  public function isService()
  {
    if($this->purchasable_type == "App\Service") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Indique si c'est un Product
   */
  public function isProduct()
  {
    if($this->purchasable_type == "App\Product") {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retourne le Purchase associé pour la sortie Eloquent
   */
  public function getPurchasableAttribute()
  {
      return $this->purchasable()->get()->first();
  }

  /**
   * Retourne le type compréhensible de l'élément (produit/service)
   */
  public function getPurchasableNameAttribute()
  {
    switch($this->purchasable_type) {
      case "App\Product": return "Produit"; break;
      case "App\Service": return "Service"; break;
      default: return "Inconnu"; break;
    }
  }

  /**
   * Attributs cachés
   *
   * @var array
   */
  protected $hidden = ['purchasable_id'];

  /**
   * Attributs rajoutés
   *
   * @var array
   */
  protected $appends = ['purchasable', 'purchasableName', 'statusName', 'totalPrice'];


  /**
  *   Récupérer le nom du statut
  *
  */
  public function getStatusNameAttribute(){
    switch ($this->status) {
      case 5:
        $statusName = "Annulé";
        break;
      case 4:
        $statusName = "Annulé";
        break;
      case 3:
        $statusName = "Réalisé";
        break;
      case 2:
        $statusName = "Validé (Client)";
        break;
      case 1:
        $statusName = "Validé (Fablab)";
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
  *   Donne le prix de l'élement sous forme de string
  *
  */
  public function getTotalPriceAttribute(){
    // Note : null == 0 mais null !== 0 car pas de même type
    if ($this["finalPrice"] === null) {
      return "A déterminer";
    } else {
      return number_format($this["finalPrice"], 2).' €';
    }
  }

}
