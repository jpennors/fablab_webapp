<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use \Illuminate\Database\Eloquent\ModelNotFoundException;
use Validator;
use App\Wardrobe;
use App\Room;


class WardrobesController extends Controller
{

    public static $rightName = 'wardrobe';
    

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Wardrobe::all();
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
        $validator = Validator::make($request->all(), Wardrobe::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        //Création de l'instance
        $wardrobe = new Wardrobe();
        $wardrobe->name = $request->name;
        $wardrobe->room_id = $request->room_id;

        // On essaye d'enregistrer
        try {
            $wardrobe->save();
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
        $wardrobe = Wardrobe::findOrFail($id);
        return response()->success($wardrobe);
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
        // Récupération de l'étagère
        $wardrobe = Wardrobe::findOrFail($id);
        $validator = Validator::make($request->all(), Wardrobe::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On met à jour
        $wardrobe->name = $request->name;
        $wardrobe->room_id = $request->room_id;

        // On essaye d'enregistrer
        try {
            $wardrobe->save();
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
        // Récupération de l'étagère
        $wardrobe = Wardrobe::findOrFail($id);

        // On essaye de supprimer
        try {
            // Suppression des relations associées
            $wardrobe->deleteRelatedRelationship();
            // Suppresion
            $wardrobe->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }

        return response()->success();
    }

}
