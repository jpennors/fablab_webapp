<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use \Illuminate\Database\Eloquent\ModelNotFoundException;
use Validator;
use App\Tool;
use App\Chemical;
use App\Wardrobe;
use App\Room;
use Excel;
use App\Exports\ToolsExport;
use Carbon\Carbon;


class ToolsController extends Controller
{


    public static $rightName = 'tool';
    

    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $data = Tool::all();
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
        $validator = Validator::make($request->all(), Tool::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On vérifie que le Tool n'existe pas déjà
        if(Tool::where('name', $request->input('name'))->get()->first()) {
            return response()->error("L'outil existe déjà, conflit", 409);
        }

        //Création de l'instance
        if($request->input('type')=='chemical'){
            // Validation des inputs
            $validator = Validator::make($request->all(), Chemical::$rules);

            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                return response()->inputError($validator->errors(), 422);
            }

            // On vérifie que le Chemical n'existe pas déjà
            if(Chemical::where('name', $request->input('name'))->get()->first()) {
                return response()->error("Le produit chimique existe déjà, conflit", 409);
            }

            $tool = new Chemical();
            $tool->type = 'chemical';
            $tool->expiryDate  = $request->input('expiryDate');
            $tool->dateOfPurchase  = $request->input('dateOfPurchase');

        }
        else {
            $tool = new Tool();
            $tool->type = 'tool';
        }
        
        $tool->name = $request->input('name');
        $tool->description = $request->input('description');
        $tool->supplier  = $request->input('supplier');
        $tool->remainingQuantity = $request->input('remainingQuantity');
        $tool->minQuantity = $request->input('minQuantity');
        $tool->quantityUnit = $request->input('quantityUnit');
        $tool->toxicity  = $request->input('toxicity');
        $tool->room_id = $request->room_id;
        $tool->wardrobe_id = $request->wardrobe_id;
        
        // On essaye d'enregistrer
        try {
            $tool->save();
        } catch(\Exception $e) {
            return response()->inputError("Can't save the resource", 500);
        }

        return response()->success(array("newId" => $tool->id), 201);
    }


    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id)
    {
        $tool = Tool::findOrFail($id);
        return response()->success($tool);
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

        if($request->input('type') == 'tool'){
            //On récupère l'outil 
            $tool = Tool::findOrFail($id);
        }
        if($request->input('type') == 'chemical') {
            //On récupère le produit chimique
            $tool = Chemical::findOrFail($id);

            $tool->expiryDate  = $request->input('expiryDate');
            $tool->dateOfPurchase  = $request->input('dateOfPurchase');
            $tool->toxicity  = $request->input('toxicity');

            // Validation des inputs
            $validator = Validator::make($request->all(), Chemical::$rules);

            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                return response()->inputError($validator->errors(), 422);
            }

        }
        
        //Outils et produits chimiques doivent respecter les règles de Tool
        $validator = Validator::make($request->all(), Tool::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }
        
        $tool->name = $request->input('name');
        $tool->description = $request->input('description');
        $tool->type  = $request->input('type');
        $tool->remainingQuantity = $request->input('remainingQuantity');
        $tool->minQuantity = $request->input('minQuantity');
        $tool->quantityUnit = $request->input('quantityUnit'); 
        $tool->supplier  = $request->input('supplier');   
        $tool->room_id = $request->room_id;
        $tool->wardrobe_id = $request->wardrobe_id;    

        // On essaye d'enregistrer
        try {
            $tool->save();
        } catch(\Exception $e) {
            return response()->inputError("Can't update the resource", 500);
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
        // Récupération du consommable
        $tool = Tool::findOrFail($id);

        // Suppression Room
        $tool->setRoomidNull();

        // Suppression de l'image
        $tool->deleteImage();

        // On essaye de supprimer
        try {
            $tool->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }

        return response()->success();
    }

    /* 
    *Fonction d'export 
    *
    */
    public function exportFile()
    {
        return Excel::download(new ToolsExport('App\Tool'), 'data.xlsx');
    }


    /* 
    * Fonction d'import 
    *
    */
    public function importSave(Request $newTools){

        foreach ($newTools->data as $newTool) {

            if ($newTool["room"])
                $newTool["room_id"] = Room::where("name", "=", $newTool["room"])->get()->first()->id;
            if ($newTool["wardrobe"])
                $newTool["wardrobe_id"] = Wardrobe::where("name", "=", $newTool["wardrobe"])->get()->first()->id;
            
            // Validation des inputs
            $validatorTool = Validator::make($newTool, Tool::$rules);
            
            // Mauvaises données, on retourne les erreurs
            if($validatorTool->fails()) {
                $validatorTool->errors()->add("L'erreur port sur l'item", $newTool["name"]);
                return response()->inputError($validatorTool->errors(), 422);
            }
            
            if ($newTool["type"] == "chemical") {
                // Validation des inputs chemical
                $validatorChemical = Validator::make($newTool, Chemical::$rules);
                // Mauvaises données, on retourne les erreurs
                if($validatorChemical->fails()) {
                    $validatorChemical->errors()->add("L'erreur porte sur l'item", $newTool["name"]);
                    return response()->inputError($validatorChemical->errors(), 422);
                }
            }
            
        }

        $tools = Tool::all();
        
        foreach ($tools as $tool) {
            $this->destroy($tool->id);
        }

        foreach ($newTools->data as $newTool) {

            //On vérifie si la combinaison id et nom n'est pas également a un élément dans la bdd
            $t = Tool::withTrashed()->where('name', $newTool['name'])->get()->first();

            if($t){
                $t->restore();
                $t->update($newTool);
            }
            else{
                $request = new Request($newTool);
                $this->store($request);
            }
        }
    }


    /*
    * Sauvegarder une image
    *
    */
    public function uploadImage(Request $request, $id) {

        // Récupération de l'outil
        $tool = Tool::findOrFail($id);
        
        return $tool->uploadImage($request->updatePic);
    }


    /*
    * Récupérer l'image d'un outil
    *
    */
    public function getImage(Request $request, $id) {

        // Récupération de l'outil
        $tool = Tool::findOrFail($id);
        
        return $tool->getImage();

    }
}
