<?php

namespace App\Http\Controllers;

use App\Product;
use App\PurchasedElement;
use App\Service;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Categorie;
use Payutc;
use Validator;
use Log;
use Exception;

use App\Purchase;
use App\Transaction;
use App\Exceptions\PayutcException;

class PayutcController extends Controller
{


    /**
    * Procède au paiement d'une Purchase avec le badge_id du payeur
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function payBadgeuse(Request $request, $id)
    {

        // Vérification des autorisations
        $this->authorize('pay-someone-payutc');

        // Récupération la purchase liée à l'id
        $p = Purchase::find($id);

        // Vérification de l'existence de la purchase
        if (!$p) {
            return response()->error("Id $id doesn't found", 404);
        }

        // Vérifie que la facture n'a pas déjà été payée
        if($p->paid)
            return response()->error("La facture a déjà été payée", 409);

        // Vérifie que le badge_id est fourni
        // Vérifie que le sessionid est fourni
        $validator = Validator::make($request->all(), [
          'token' => 'required|string',
          'badge_id' => 'required|string'
        ]);

        // Si la vérification échoue, renvoie d'une erreur
        if ($validator->fails())
            return response()->error('Mauvais inputs', 422, $validator->errors());

        // Création d'un objet d'items
        $objects = $this->getElementsFromNemopay($p->lastVersionElements);

        // Procède aux requêtes vers Nemopay
        $transaction = null;
        try {

            // Création d'une transaction avec Payutc
            $transaction = Payutc::payBadgeuse($request->input('badge_id'), $objects);

        } catch (PayutcException $e) {
      
            Log::error($e->getMessage());
            return response()->error($e->getMessage(), $e->getStatus());
    
        } catch (\Exception $e) {
      
            // Au cas où une PayutcException n'est pas raised
            Log::error($e->getMessage());
            return response()->error("Impossible d'effectuer le paiement, erreur interne.", 500);
    
        }

        // Paiement réussi, on enregistre la transaction
        $transaction->purchase()->associate($p);
        $transaction->save();

        return response()->success("Paiement effectué");
    }


    /**
    * Procède au paiement d'une Purchase en ligne en créant une transaction, seulement pour services
    *
    */
    public function payCard(Request $request, $id)
    {

        // Récupération de la purchase liée à l'id
        $p = Purchase::find($id);

        // Vérification de l'existence de la purchase
        if (!$p) {
            return response()->error("Id $id doesn't found", 404);
        }

        // Vérifie que la facture n'a pas déjà été payée
        if($p->paid)
            return response()->error("La facture a déjà été payée", 409);

        $validator = Validator::make($request->all(), [
          'return_url' => 'required|string',
        ]);

        // Si la vérification échoue, renvoie d'une erreur
        if ($validator->fails())
            return response()->error('Mauvais inputs', 422, $validator->errors());


        $objects = Payutc::getServicesElement($p);

        // Procède aux requêtes de paiement vers Nemopay
        try {

            // Création d'une transaction avec Payutc
            $res = Payutc::payCard($objects, $request->return_url);

        } catch (PayutcException $e) {
      
            Log::error($e->getMessage());
            return response()->error($e->getMessage(), $e->getStatus());
    
        } catch (\Exception $e) {
      
            // Au cas où une PayutcException n'est pas raised
            Log::error($e->getMessage());
            return response()->error("Impossible d'effectuer le paiement, erreur interne.", 500);
    
        }

        // On enregistre la transaction, pas encore payé
        $transaction = new Transaction([
            'name'          => $res['name'],
            'session_id'    => $res['session_id'],
            'payutc_id'     => $res['payutc_id'],
            'purchase_id'   =>  $p->id,
            'paid'          => false
        ]);
        $transaction->save();

        // On renvoie l'URL pour payer la transaction
        return response()->success($res['url']);
    }


    /**
    * Get Transaction information
    *
    */
    public function getTransactionInfo(){

        // Appel vers Payutc pour récupérer les informations
        $info = Payutc::getTransactionInfo();

        if (!$info) {
            return response()->error("Pas de transaction liée à la session", 500);
        }

        return response()->success($info);

    }


    /**
    * Récupère une catégorie Weeze
    *
    */
    public function categories()
    {

        $data = Payutc::getCategories();
        return response()->success($data);
    
    }


    /**
    * Récupère les éléments Nemopay
    *
    */

    protected function getElementsFromNemopay(Array $elements){

        // Création d'un objet d'items
        $objects = [];

        /* On itère dans les éléments de la purchase */
        foreach ($elements as $element) {

            // Pourcentage de réduction mis à 0
            $reduction = 0;

            // Element de type Service
            if ($element->purchasable instanceof Service) {

                $quantity = 1;
                $data = [
                    'stock' => $quantity,
                    // 'prix'  => 0,
                    'prix' => $element->finalPrice*100,
                    'categObj'  =>  'Service'
                ];

            }
        
            // Element de type Product
            else if ($element->purchasable instanceof Product) {
                
                // Récupération de la catégorie du produit
                $categObj = $element->purchasable->categorie()->get()->first()->name;
                $quantity = $element->purchasedQuantity;

                // Création d'un objet pour le produit (Quantité / Prix / Catégorie)
                $data = [
                    'stock' => $quantity,
                    'prix'  => $element->finalPrice*100,
                    'categObj'  => $categObj
                ];              
               
            } else {
                // Erreur
                throw new Exception("Purchasable type ".$element->purchasable_type." unknow.");
            }

            // Récupération de l'id de l'élément
            // Set Product met à jour l'objet s'il est déjà existant ou le crée
            $payutc_id = Payutc::setProduct($element->purchasable->name, $data);

            // Ajout dans les items de la commande (Id de l'élément / Quantité / Réduction -> par défait 0)
            $objects[] = [
                $payutc_id,
                $quantity,
            ];
    
        }
    
        return $objects;
  
    }

}
