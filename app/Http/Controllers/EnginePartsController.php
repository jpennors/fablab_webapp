<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

use App\EnginePart;
use App\Engine;



class EnginePartsController extends Controller
{
    //public static $rightName = 'enginePart';
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $data = EnginePart::all();
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
        $validator = Validator::make($request->all(), EnginePart::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On vérifie que le EnginePart n'existe pas déjà
        if((EnginePart::where('name', $request->input('name'))->get()->first())&&(EnginePart::where('engine_id', $request->input('engine_id'))->get()->first())) {
            return response()->error("La pièce existe déjà pour cette machine, conflit, choisissez un autre nom", 409);
        }

        //Création de l'instance
        $enginePart = new EnginePart();

        $enginePart->engine()->associate(Engine::findOrFail($request->input('engine_id')));
        $enginePart->name = $request->input('name');
        $enginePart->description = $request->input('description');
        $enginePart->time_to_maintenance  = $request->input('time_to_maintenance');
        $enginePart->next_maintenance = $request->input('time_to_maintenance');
        $enginePart->need_maintenance = false;
        
        // On essaye d'enregistrer
        try {
            $enginePart->save();
        } catch(\Exception $e) {
            return response()->inputError("Can't save the resource", 500);
        }

        return response()->success(array("newId" => $enginePart->id), 201);
    }

    /**
    * Display the specified resource.
    *
    * @param  int  $id
    * @return \Illuminate\Http\Response
    */
    public function show($id)
    {
        $enginePart = EnginePart::findOrFail($id);

        return response()->success($enginePart);
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
      $enginePart = EnginePart::findOrFail($id);
      $validator = Validator::make($request->all(), EnginePart::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      // On met à jour
      $enginePart->name = $request->input('name');
      $enginePart->description = $request->input('description');
      $enginePart->time_to_maintenance  = $request->input('time_to_maintenance');
      $enginePart->next_maintenance = $request->input('time_to_maintenance');

      $enginePart->engine()->associate(Engine::findOrFail($request->input('engine_id')));

      // On essaye d'enregistrer
      try {
        $enginePart->save();
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
      $enginePart = EnginePart::findOrFail($id);
  
      // On essaye de supprimer
      try {
        $enginePart->delete();
      } catch(\Exception $e) {
        return response()->inputError("Can't delete the resource", 500);
      }
  
      return response()->success();
    }


    

    public function resetMaint($id){
        $enginePart = EnginePart::findOrFail($id);
        $enginePart->need_maintenance = false;
        $enginePart->save();
        return response()->success();
    }
}
