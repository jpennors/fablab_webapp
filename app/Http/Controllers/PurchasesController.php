<?php

namespace App\Http\Controllers;

use Auth;
use Gate;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Purchase;
use App\PurchasedElement;
use App\Service;
use App\Product;
use App\User;
use App\Member;
use App\Administrative;
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
    public function index()
    {
        // Afficher toutes les commandes seulement si l'utilisateur est abilité,
        // sinon afficher les commandes de l'entité à laquelle il est rattaché
        if (Gate::check('view-all-entity-purchase')) {
            $data = Purchase::all();
        } else {
            $data = Purchase::where('login', Auth::user()->login)->get();
        }

        return response()->success($data);
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



        try {
            $purchase->save();
        } catch(\Exception $e) {
            return response()->error("Can't save the resource", 500);
        }
        return response()->success(array("newId" => $purchase->id), 201);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Purchase::findOrFail($id);
        return response()->success($data);
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
        $purchase = Purchase::findOrFail($id);

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
        $purchase = Purchase::findOrFail($id);

        // Permanencier
        $user = Auth::user();

        $view = view('quote-id', ['purchase' => $purchase, 'user' => $user]);

        $pdf = PDF::loadHTML($view)
            ->setOption('zoom', '0.8')
            ->setOption('footer-center', '[page]/[topage]')
            ->setOption('footer-font-size', '9');

        //dd($pdf);

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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function updateElement(Request $request, $id)
    {

        $p = Purchase::findOrFail($request->input("purchase_id"));
        // return response()->success("pouletto");

        // Création de l'instance reliée à la Purchase
        $pe = new PurchasedElement();
        $pe->purchase()->associate($p);


        // Ajout du lien entre le Service/Product associé
        if($request->input("purchasable_type") == "service" || $request->input("purchasable_type") == "App\Service") {
            Service::find($request->input("purchasable_id"))->purchases()->save($pe);
            $pe->args = $request->input("args");
            $pe->deadline = ($request->has("deadline") ? $request->input("deadline") : null);
            $pe->comment = ($request->has("comment") ? $request->input("comment") : null);
        }
        else
            Product::find($request->input("purchasable_id"))->purchases()->save($pe);

        // Ajout des infos supplémentaires
        $pe->id = $request->input("id");
        $pe->purchasedQuantity = $request->input("purchasedQuantity");
        $pe->suggestedPrice = $request->input("suggestedPrice");
        $pe->finalPrice = $request->input("finalPrice");
        $pe->login_edit = $request->input("login_edit");
        $pe->version = $request->input("version");
        $pe->status = $request->input("status");

        try {
            $pe->save();
        } catch(\Exception $e) {
            return response()->error("Can't update the purchased element", 500);
        }

        // Suppression des fichiers
        if($request->has('deleted_files')){
            foreach ($request->input('deleted_files') as $deleted_file) {
                $this->deleteFile($pe->id, $deleted_file);
            }
        }

        // Suppression du répertoire quand le service est terminé        
        if($pe->status == 4 || $pe->status == 5 || $pe->status == 3){
            $this->deleteDirectory($pe->id);
        }
        
        return response()->success($pe);

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
        $p = Purchase::findOrFail($id);

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
    }


    public function removeAddress(Request $request, $id){
        $p = Purchase::findOrFail($id);

        try {
            $p->address_id = null;
            $p->save();
        } catch(\Exception $e) {
            return response()->inputError("Impossible de supprimer l'adresse.", 500);
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
        $purchase = Purchase::findOrFail($id);

        try {
            $purchase->entity()->associate($request->input('entity_id'));
        } catch (\Exception $e) {
            return response()->inputError("Impossible d'enregistrer l'entité", 500);
        }

        return response()->success();
    }

}
