<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 04/12/2017
 * Time: 16:04
 */

namespace App\Http\Controllers;


use App\Entity;
use Validator;
use Illuminate\Http\Request;

class EntitiesController extends Controller
{
    
    /**
     * @inheritdoc
     */
    public static $rightName = "entity";

    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $data = Entity::all();
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
        $validator = Validator::make($request->all(), Entity::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On vérifie que l'entité n'existe pas déjà
        if(Entity::where('name', $request->input('name'))->get()->first()) {
            return response()->error("The Room already exists, conflict", 409);
        }

        //Création de l'instance
        $e = new Entity();

        // On essaye d'enregistrer
        try {
        
            $e->create($request->all());
        
        } catch(\Exception $e) {
            
            return response()->inputError("Can't save the resource", 500);
        
        }

        return response()->success();
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $e = Entity::findOrFail($id);
        return response()->success($e);
    
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
        
        // Récupération de l'entité
        $e = Entity::findOrFail($id);

        // Validation des inputs
        $validator = Validator::make($request->all(), Entity::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // L'entité Fablab UTC ne peut changer de nom
        if ($e->name == "Fablab UTC") {
            $request->merge(['name' => "Fablab UTC"]);
        }

        // On essaye de mettre à jour
        try {

            $e->update($request->all());
        
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
      
        // Récupération de l'entité
        $e = Entity::findOrFail($id);

        // L'éntité Fablab UTC ne peut être supprimée
        if ($e->name == "Fablab UTC") {
            return response()->inputError("L'entité Fablab UTC ne peut être supprimée.", 403);
        }

        // On essaye de supprimer
        try {
            
            $e->delete();
        
        } catch(\Exception $e) {
        
            return response()->inputError("Can't delete the resource", 500);
        
        }

        return response()->success();
    }
}