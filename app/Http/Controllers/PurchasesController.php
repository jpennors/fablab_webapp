<?php

namespace App\Http\Controllers;

use Auth;
use Gate;
use Illuminate\Http\Request;
// use App\Http\Requests;
use App\Purchase;
use App\PurchasedElement;
use App\Service;
use App\Product;
use App\User;
use App\Member;
use App\Administrative;
use App\Semester;
use Request as Request_input;
use App\Address;
use Validator;
use PDF;
use App\Http\Controllers\PurchasedElementsController;

class PurchasesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $semester_id = Semester::getSemesterToUse();

        // Afficher toutes les commandes seulement si l'utilisateur est abilité,
        // sinon afficher les commandes de l'entité à laquelle il est rattaché
        if (Gate::check('view-all-entity-purchase')) {
            $data = Purchase::where('semester_id', $semester_id)->get();
        } else {
            $data = Purchase::where([
                ['login', Auth::user()->login],
                ['semester_id', $semester_id],
            ])->get();
        }

        return response()->success($data);
    }

    /**
    *   Sort tous les commandes en cours
    */
    public function getPersonalIndex()
    {
        $semester_id = Semester::getSemesterToUse();

        $data = Purchase::withTrashed()->where([
            ['login', Auth::user()->login],
            ['semester_id', $semester_id]
        ])->get();

        return response()->success($data);

    }


    /**
    *   Sort tous les commandes dans l'historique
    */
    public function getHistoryIndex()
    {
        $semester_id = Semester::getSemesterToUse();
        
        if (Gate::check('view-all-entity-purchase')) {   
            $data = Purchase::getHistoryIndex($semester_id);
            return response()->success($data);
        }   
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(Request $request)
    {

        if (Gate::check('order-for-someone') || Gate::check('order-CAS-member')){

            $semester_id = Semester::getSemesterToUse();

            // Validation des inputs
            $validator = Validator::make($request->all(), Purchase::$rules);

            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                return response()->inputError($validator->errors(), 422);
            }

            $purchase = new Purchase();
            $purchase->association = $request['association'];
            $purchase->entity_id = $request['entity_id'];
            $purchase->login = $request['login'];
            $purchase->semester_id = $semester_id;

            try {
                $purchase->save();
            } catch(\Exception $e) {
                return response()->error("Can't save the resource", 500);
            }
            return response()->success($purchase, 201);
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Purchase::withTrashed()->where('id', $id)->get()->first();
     
        if(Gate::check('view-all-entity-purchase') || $data->login == Auth::user()->login){
            return response()->success($data);
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }

        
    }


    /**
     * Facture en PDF
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function pdf(Request $request, $id)
    {
        $this->authorize('generate-invoice');
        /** @var Purchase $purchase */
        $purchase = Purchase::withTrashed()->where('id', $id)->get()->first();

        if(!$purchase->address_id) {
            return response()->error("Aucune addresse n'a été fournie pour la facture.", 422);
        }
        if (!$purchase->paid) {
            return response()->error("La commande n'a pas été payée, impossible de génerer une facture non payée.", 422);
        }
        // Permanencier
        $user = Auth::user();

        $view = view('invoice', ['purchase' => $purchase, 'user' => $user]);

        $pdf = PDF::loadHTML($view)
            ->setOption('zoom', '0.8')
            ->setOption('footer-center', '[page]/[topage]')
            ->setOption('footer-font-size', '9');

        if($request->input('dl') && $request->input('dl') == 1)
            return $pdf->download('Facture_Fablab_' . $purchase->number . '.pdf');
        else
            return $pdf->inline();
    }


    /**
     * Devis en PDF depuis un id
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function quoteFromId(Request $request, $id)
    {
        $this->authorize('generate-quotation');
        /** @var Purchase $purchase */
        $purchase = Purchase::withTrashed()->where('id', $id)->get()->first();

        // Permanencier
        $user = Auth::user();

        $view = view('quote-id', ['purchase' => $purchase, 'user' => $user]);

        $pdf = PDF::loadHTML($view)
            ->setOption('zoom', '0.8')
            ->setOption('footer-center', '[page]/[topage]')
            ->setOption('footer-font-size', '9');

        if($request->input('dl') && $request->input('dl') == 1)
            return $pdf->download('Devis_Fablab.pdf');
        else
            return $pdf->inline();
    }


    /**
     * Devis en PDF
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function quote(Request $request)
    {
        $this->authorize('generate-quotation');

        $validator = PurchasedElementsController::validateElements($request);

        if($validator->fails())
            return response()->inputError($validator->errors(), 422);

        // Récupération des PurchasedElements
        $elements = [];
        $elements['products'] = [];
        $elements['services'] = [];
        $elements['totalProducts'] = 0;
        $elements['totalServices'] = 0;
        foreach($request->input('elements') as $element) {
            if($element['purchasable_type'] == "product") {
                $elements['totalProducts'] += $element['finalPrice'];
                array_push($elements['products'], $element);
            }
            elseif($element['purchasable_type'] == "service") {
                $elements['totalServices'] += $element['finalPrice'];
                array_push($elements['services'], $element);
            }
        }
        $elements['total'] = $elements['totalProducts'] + $elements['totalServices'];

        // Permanencier
        $user = Auth::user();

        $view = view('quote', ['elements' => $elements, 'user' => $user]);

        $pdf = PDF::loadHTML($view)
            ->setOption('zoom', '0.8')
            ->setOption('footer-center', '[page]/[topage]')
            ->setOption('footer-font-size', '9');

        if($request->input('dl') && $request->input('dl') == 1)
            return $pdf->download('Devis_Fablab.pdf');
        else
            return $pdf->inline();
    }


    /**
     * Ajoute une adresse pour la facture
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function address(Request $request, $id)
    {
        $p = Purchase::withTrashed()->where('id', $id)->get()->first();

        if(Gate::check('edit-order') || $p->login == Auth::user()->login){

            $validator = Validator::make($request->all(), Address::$rules);

            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                return response()->inputError($validator->errors(), 422);
            }

            $address = Address::where('name', $request->input('name'))->get()->first();

            if($address) {
                // dd($address);
                $address->address = $request->input('address');
                $address->city = $request->input('city');
                $address->cp = $request->input('cp');
                $address->country = $request->input('country');
            } else {
                $address = new Address([
                    'name' => $request->input('name'),
                    'address' => $request->input('address'),
                    'city' => $request->input('city'),
                    'cp' => $request->input('cp'),
                    'country' => $request->input('country')
                ]);
            }

            try {
                $address->save();
                $p->address()->associate($address);
                $p->save();
            } catch(\Exception $e) {
                return response()->inputError("Impossible d'enregistrer l'adresse.", 500);
            }
            return response()->success();
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    public function removeAddress(Request $request, $id){

        $p = Purchase::withTrashed()->where('id', $id)->get()->first();

        if(Gate::check('edit-order') || $p->login == Auth::user()->login){

            try {
                $p->address_id = null;
                $p->save();
            } catch(\Exception $e) {
                return response()->inputError("Impossible de supprimer l'adresse.", 500);
            }
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    /**
     * Associe une entité pour une commande
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function entity(Request $request, $id)
    {
        $this->authorize('change-purchase-entity');

        /** @var Purchase $purchase */
        $purchase = Purchase::withTrashed()->where('id', $id)->get()->first();

        try {
            $purchase->entity()->associate($request->input('entity_id'));
        } catch (\Exception $e) {
            return response()->inputError("Impossible d'enregistrer l'entité", 500);
        }

        return response()->success();
    }


    /** 
    *   Marque une commande comme payée
    */
    public function externalPaid(Request $request, $id)
    {

        $this->authorize('mark-as-paid');

        $purchase = Purchase::findOrFail($id);

        if($purchase->paid)
            return response()->error("La facture a déjà été payée", 400);
        else if (!$purchase->externalPaid) {
            try {
                $purchase->externalPaid = \Carbon\Carbon::now();
                $purchase->save();
            } catch (\Exception $e) {
                return response()->inputError("Impossible de mettre à jour le paiement de cette commande", 500);
            }
        }

        //Mise à jour de la commande si terminée
        Purchase::softDeletePurchase($id);

        return response()->success();

    }
}
