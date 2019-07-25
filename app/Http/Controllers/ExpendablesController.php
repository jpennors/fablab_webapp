<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Expendable;
use App\Room;
use App\Wardrobe;
use Validator;
use Excel;
use App\Exports\ExpendablesExport;

class ExpendablesController extends Controller
{


    public static $rightName = 'expendable';
    


    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

        $data = Expendable::all();
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
        $validator = Validator::make($request->all(), Expendable::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // Nom du consommable unique
        if(Expendable::where('name', $request->input('name'))->get()->first()) {
            return response()->error("An expandable with the same name exists, conflict", 409);
        }

        // Vérification clé étrangère room_id et wardorbe_id
        if ($request->room_id && $request->wardrobe_id) {
            $w = Wardrobe::findOrFail($request->wardrobe_id);
            if ($w->room_id != $request->room_id) {
                return response()->error("La salle et l'étagère ne sont pas liées", 409);
            }
        }


        // Création de l'instance
        $ajout = new Expendable();

        // On essaye d'enregistrer
        try {

            $ajout->create($request->all());
        
        } catch(\Exception $e) {
        
            return response()->error("Can't save the resource", 500);
        
        }
        
        return response()->success(array("newId" => $ajout->id), 201);
    }



    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id)
    {

        $data = Expendable::findOrFail($id);   
        return response()->success($data);

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
        
        // Récupération du consommable
        $res = Expendable::findOrFail($id);
        
        // Validation des inputs
        $validator = Validator::make($request->all(), Expendable::$rules);

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
        // Récupération du consommable
        $expendable = Expendable::findOrFail($id);

        // Suppression Room
        $expandable->setRoomidNull();

        // Suppression de l'image
        $expendable->deleteImage();

        // On essaye de supprimer
        try {         
            $expendable->delete();   
        } catch(\Exception $e) {
            dd($e);
            return response()->inputError("Can't delete the expendable", 500);
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
        return Excel::download(new ExpendablesExport('App\Expendable'), 'data.xlsx');
    }


    public function importSave(Request $newExpendables){

        $this->authorize('import-data');

        foreach ($newExpendables->data as $newExpendable) {

            if ($newExpendable["room"])
                $newExpendable["room_id"] = Room::where("name", "=", $newExpendable["room"])->get()->first()->id;
            if ($newExpendable["wardrobe"])
                $newExpendable["wardrobe_id"] = Wardrobe::where("name", "=", $newExpendable["wardrobe"])->get()->first()->id;
            
            // Validation des inputs
            $validator = Validator::make($newExpendable, Expendable::$rules);
            
            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                $validator->errors()->add("L'erreur porte sur l'item", $newExpendable["name"]);
                return response()->inputError($validator->errors(), 422);
            }
        }

        $expendables = Expendable::all();
        
        foreach ($expendables as $expendable) {
            $this->destroy($expendable->id);
        }

        foreach ($newExpendables->data as $newExpendable) {

            //On vérifie si la combinaison id et nom n'est pas également a un élément dans la bdd
            $e = Expendable::withTrashed()->where('name', $newExpendable['name'])->get()->first();

            if($e){
                $e->restore();
                $e->update($newExpendable);
            }
            else{
                $request = new Request($newExpendable);
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
        
        // Récupération du consommable
        $expendable = Expendable::findOrFail($id);
        
        return $expendable->uploadImage($request->updatePic);
    }

    public function getImage(Request $request, $id) {

        // Récupération de l'image
        $expendable = Expendable::findOrFail($id);
        
        return $expendable->getImage();
    }

}
