<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Engine;
use App\Room;
use Excel;
use App\Exports\EnginesExport;

class EnginesController extends Controller
{


    public static $rightName = 'engine';


    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

        $data = Engine::all();
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
        $validator = Validator::make($request->all(), Engine::$rules);
        
        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        //Unicité du nom
        if(Engine::where('name', $request->input('name'))->get()->first()) {
            return response()->error("Il existe déjà une machien portant le même nom, conflict", 409);
        }

        // Création de l'instance
        $engine = new Engine();

        // On essaye d'enregistrer
        try {

          $engine->create($request->all());
        
        } catch(\Exception $e) {
          
            return response()->error("Can't save the resource", 500);
        
        }

        return response()->success(array('newId' => $engine->id), 201);
    }


    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id)
    {

        $engine = Engine::findOrFail($id);
        return response()->success($engine);
    
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

        // Récupération de l'engine
        $engine = Engine::findOrFail($id);

        // Validation des données
        $validator = Validator::make($request->all(), Engine::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }  

        // Impossibilité de changer le nom de la machine
        $request->merge(['name' => $engine->name]);

        // On essaye d'enregistrer
        try {

            $engine->update($request->all());

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

        // Récupération de la machine
        $engine = Engine::findOrFail($id);

        // Suppression Room
        $engine->setRoomidNull();

        // Suppression de l'image
        $engine->deleteImage();

        // On essaye de supprimer
        try {
            $engine->delete();
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
        
        return Excel::download(new EnginesExport('App\Engine'), 'data.xlsx');
    
    }

    
    public function importSave(Request $newEngines){

        $this->authorize('import-data');


        // Vérification de toutes les données de l'import
        foreach ($newEngines->data as $newEngine) {

            if ($newEngine["room"]) {
                $newEngine["room_id"] = Room::where("name", "=", $newEngine["room"])->get()->first()->id;
            }

            // Validation des inputs
            $validator = Validator::make($newEngine, Engine::$rules);   

            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                $validator->errors()->add("L'erreur porte sur l'item", $newEngine["name"]);
                return response()->inputError($validator->errors(), 422);
            }
        
        }

        // Suppression de tous les machines (softDeletes)
        $engines = Engine::all();
        foreach ($engines as $engine) {
            $this->destroy($engine->id);
        }

        // Importation des nouvelles
        foreach ($newEngines->data as $newEngine) {

            //On vérifie si la combinaison id et nom n'est pas également a un élément dans la bdd
            $e = Engine::withTrashed()->where('name', $newEngine['name'])->get()->first();

            if($e){
                $e->restore();
                $e->update($newEngine);
            }
            else{
                $request = new Request($newEngine);
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

        // Récupération de la machine
        $engine = Engine::findOrFail($id);

        return $engine->uploadImage($request->updatePic);

  }

    public function getImage(Request $r, $id) {

        // Récupération de la machine
        $engine = Engine::findOrFail($id);

        return $engine->getImage();

    }


    /** 
    *   Utilisation d'une machine, appelle des engine parts pour décrémentation
    *
    */

    public function usedEngine($id, $time){
        
        $engine = Engine::findOrFail($id);
        return $engine->usedEnginePart($time);

    }


}
