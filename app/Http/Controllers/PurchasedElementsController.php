<?php

namespace App\Http\Controllers;

use App\Exceptions\PayutcException;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Purchase;
use App\PurchasedElement;
use App\Service;
use App\Product;
use App\User;
use App\Member;
use App\PurchaseFile;
use Validator;
use File;
use Illuminate\Support\Facades\Storage;
use Response;
use Gate;


class PurchasedElementsController extends Controller
{

    public function index()
    {

        $this->authorize('view-all-entity-purchase');

        $elements = PurchasedElement::where("purchasable_type", "<>", "App\Product")->get();
        $maxVersions = [];

        // Mise en forme des purchased Elements, tri par id et par version

        // On cherche la plus grand e valeur de l'attribut version pour chaque élément 
        for($i = 0; $i < count($elements); $i++) {
            $element = $elements[$i];
            if(!isset($maxVersions[$element['id']])) {
                $maxVersions[$element['id']] = $element['version'];
            }else {
                if($maxVersions[$element['id']] < $element['version']){
                    $maxVersions[$element['id']] = $element['version'];
                }
            }
        }

        $res = [];
        // On met dans un tableau chaque élément correspondant a la version maximale
        foreach ($elements as $element) {
            if($element['version'] == $maxVersions[$element['id']]) {
                array_push($res, $element);
            }
        }

        foreach ($res as $element) {
            $element->files = PurchaseFile::where('purchased_id', $element->id)->get();
        }
        return response()->success($res);
    }


    public function storeElement(Request $request) {

        $p = Purchase::findOrFail($request->input('purchase_id'));

        if(Gate::check('order-for-someone') || $p->login == Auth::user()->login){

            // Création de l'instance reliée à la Purchase
            $pe = new PurchasedElement();
            $pe->purchase()->associate($p);

            // Ajout du lien entre le Service/Product associé
     
            if ($request->input('purchasable_type') == 'service') {
                Service::find($request->input('purchasable')["id"])->purchases()->save($pe);
                $pe->args = $request->input('args');
                $pe->deadline = $request->input('deadline');
                $pe->comment = $request->input('comment');
                $pe->status = $request->input('status');
            } else {
                Product::find($request->input('purchasable')["id"])->purchases()->save($pe);

                // Lorsqu'on achète un produit, le statut est automatiquement à 3
                $pe->status = 3;

                $prod = Product::findOrFail($request->input('purchasable')["id"]);
                if(($prod->remainingQuantity - $request->input('purchasedQuantity')) < 0 ) {

                    return response()->error("Pas assez de ".$prod->name." disponible.", 422);
                } else {
                    $prod->remainingQuantity -= $request->input('purchasedQuantity');
                    $prod->save();
                }
            }

            // Ajout des infos supplémentaires
            // On utilise pas l'auto incrémentation car la clé d'un purchasedElement est (id, version)
            $pe->id = PurchasedElement::all()->max('id')+1;

            $pe->purchasedQuantity = $request->input('purchasedQuantity');
            $pe->suggestedPrice = $request->input('suggestedPrice');
            $pe->finalPrice = $request->input('finalPrice');
            $pe->login_edit = $p->login;
            $pe->version = 1;

            try {
                $pe->save();
            } catch(\Exception $e) {
                return response()->error("Can't save the purchased element", 500);
            }
            return response()->success(array("newId" => $pe->id), 201);
            
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    public function updateElement(Request $request) {

        $p = Purchase::findOrFail($request->input("purchase_id"));

        if(Gate::check('edit-order') || $p->login == Auth::user()->login){

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
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    /**
    *   Fonctions : gestion des fichiers
    */

    public function saveFile(Request $request, $id) {

        $p = Purchase::findOrFail($id);

        if(Gate::check('edit-order') || Gate::check('order-for-someone') || $p->login == Auth::user()->login){

            try {

                $nb = PurchaseFile::where('purchased_id', $id)->count() + 1;
                $file = $request->file('file');
                $fileName = $nb.'_'.$file->getClientOriginalName();

                // Enregistrement du fichier
                Storage::putFileAs('public/purchased/'.$id, $file, $fileName);

                // Une fois le fichier créé, on crée le PurchaseFile
                $p = new PurchaseFile();
                $p->nom  = $fileName;
                $p->purchased_id = $id;
                $p->save();

            } catch(\Exception $e) {
                // return response()->inputError("Can't delete the files", 500);
            }

            return response()->success();
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    private function deleteDirectory($id){

        try {

            Storage::deleteDirectory('public/purchased/'.$id);

            $purchasedFiles = PurchaseFile::where('purchased_id', $id);
            // Suppresion des lignes en bdd une par une
            foreach ($purchasedFiles as $file) {
                $file->delete();
            }

        } catch(\Exception $e) {
            // return response()->inputError("Can't delete the files", 500);
        }
    }

    private function deleteFile($id, $fileName){

        try {

            Storage::delete('public/purchased/'.$id.'/'.$fileName);

            $file = PurchaseFile::where([
                ['purchased_id', '=', $id],
                ['nom', '=', $fileName]
            ]);

            $file->delete();

        } catch(\Exception $e) {
            // return response()->inputError("Can't delete the files", 500);
        }
    }

    public function getFileList(Request $request, $id) {

        $p = Purchase::findOrFail($id);

        if(Gate::check('view-all-entity-purchase') || $p->login == Auth::user()->login){

            $files = PurchaseFile::where('purchased_id', $id)->pluck('nom');

            return response()->success($files);
        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }


    public function getFile(Request $request, $id, $fileName) {

        $p = Purchase::findOrFail($id);

        if(Gate::check('view-all-entity-purchase') || $p->login == Auth::user()->login){
        
            $path = 'public/purchased/'.$id.'/'.$fileName;
            try {
                $file = Storage::get($path);
            } catch (Exception $e) {
                
            }

            $type = File::mimeType(storage_path('app/'.$path));

            $response = Response::make($file, 200);
            $response->header("Content-Type", $type);
            return $response;

        } else {
            return response()->json(array("error" => "401, Unauthorized action"), 401);
        }
    }

}
