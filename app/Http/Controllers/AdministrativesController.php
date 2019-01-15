<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Validator;
use App\Administrative;

class AdministrativesController extends Controller
{

  public static $rightName = 'administrative';


    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

        $data = Administrative::all();      
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

        $admin = Administrative::findOrFail($id);
        
        // Validation des données
        $validator = Validator::make($request->all(), Administrative::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }


        // On essaye d'enregistrer
        try {

            $admin->update($request->all());
        
        } catch(\Exception $e) {

            return response()->inputError("Can't update the resource", 500);
        
        }

        return response()->success();
  }

}
