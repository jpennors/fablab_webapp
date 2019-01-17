<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Categorie;
use App\Product;
use App\Room;
use App\Wardrobe;
use Validator;
use Payutc;
use Excel;
use App\Exports\ProductsExport;


class ProductsController extends Controller
{


    public static $rightName = 'product';
    


    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

        $data = Product::all();
        return response()->success($data);
    }




    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(Request $request)
    {
        // Validation des inputs
        $validator = Validator::make($request->all(), Product::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }
        
        // On vérifie que le product n'existe pas déjà
        if(Product::where('name', $request->input('name'))->get()->first()) {
            return response()->error("The resource already exists, conflict", 409);
        }

        // Création de l'instance
        $res = new Product();

        // On essaye d'enregistrer
        try {

            $res->create($request->all());
        
        } catch(\Exception $e) {
        
            return response()->error("Can't save the resource", 500);
        
        }

        return response()->success(array("newId" => $res->id), 201);
    }



    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id)
    {

        $data = Product::findOrFail($id);
        return response()->error("Can't show the item", 500);
    
    }


    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, $id)
    {

        // Récupération du produit
        $res = Product::findOrFail($id);

        // Validation des inputs
        $validator = Validator::make($request->all(), Product::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On essaye d'enregistrer
        try {

            $res->update($request->all());
        
        } catch(\Exception $e) {
        
            return response()->error("Can't update the resource", 500);
        }
        
        return response()->success();
    }



    /**
    * Remove the specified resource from storage.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function destroy($id)
    {

        // Récupération du produit
        $data = Product::findOrFail($id);

        // Mise à null de room, wardrobe et categorie
        $data->setRoomidNull();
        $data->setCategorieidNull();

        // Suppression de l'image
        $data->deleteImage();

        // On essaye de supprimer
        try {
            $data->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }
        return response()->success();
    }



    /*
    *
    * EXPORT / IMPORT
    *
    */

    public function exportFile()
    {
        $this->authorize('export-data');
        return Excel::download(new ProductsExport, 'data.xlsx');
    }

    public function importSave(Request $newProducts){
        
        $this->authorize('import-data');

        foreach ($newProducts->data as $newProduct) {

            if ($newProduct["categorie"])
                $newProduct["categorie_id"] = Categorie::where("name", "=", $newProduct["categorie"])->get()->first()->id;
            if ($newProduct["room"])
                $newProduct["room_id"] = Room::where("name", "=", $newProduct["room"])->get()->first()->id;
            if ($newProduct["wardrobe"])
                $newProduct["wardrobe_id"] = Wardrobe::where("name", "=", $newProduct["wardrobe"])->get()->first()->id;
            
            // Validation des inputs
            $validator = Validator::make($newProduct, Product::$rules);
            
            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                $validator->errors()->add("L'erreur porte sur l'item", $newProduct["name"]);
                return response()->inputError($validator->errors(), 422);
            }
        }

        $products = Product::all();
        
        foreach ($products as $product) {
            $this->destroy($product->id);
        }

        foreach ($newProducts->data as $newProduct) {

            //On vérifie si la combinaison id et nom n'est pas également a un élément dans la bdd
            $p = Product::withTrashed()->where('name', $newProduct['name'])->get()->first();

            if($p){
                $p->restore();
                $p->update($newProduct);
            }
            else{
                $request = new Request($newProduct);
                $this->store($request);
            }
        }
    }



    /*
    *
    * PICTURE
    *
    */
    public function uploadImage(Request $request, $id) {
        
        // Récupération du produit
        $product = Product::findOrFail($id);

        return $product->uploadImage($request->updatePic);

    }

    public function getImage(Request $request, $id) {
        
        // Récupération du produit
        $product = Product::findOrFail($id);

        return $product->getImage();
    }
}
