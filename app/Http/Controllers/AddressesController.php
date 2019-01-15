<?php

namespace App\Http\Controllers;

use App\Address;
use Validator;
use Illuminate\Http\Request;

class AddressesController extends Controller
{

    public static $rightName = 'address';


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Address::all();

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
      $validator = Validator::make($request->all(), Address::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      // On vérifie que l'adesse n'existe pas déjà
      if(Address::where('name', $request->input('name'))->get()->first()) {
        return response()->error("L'addresse existe déjà, conflit", 409);
      }

      //Création de l'instance
      $a = new Address();

      // On essaye d'enregistrer
      try {
        
        $a->create($request->all());
      
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
        $a = Address::findOrFail($id);
       
        return response()->success($a);
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
        //Récupération de l'adresse à mettre à jour
        $a = Address::findOrFail($id);

        // Validation des données
        $validator = Validator::make($request->all(), Address::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On essaye d'enregistrer
        try {
        
            $a->update($request->all());
        
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

        $a = Address::findOrFail($id);

        // On essaye de supprimer
        try {
            
            $a->delete();
      
        } catch(\Exception $e) {
        
            return response()->inputError("Can't delete the resource", 500);
        
        }

        return response()->success();
    
    }
}