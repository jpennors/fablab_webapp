<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Semester;
use Validator;

class SemestersController extends Controller
{


    public static $rightName = 'semesters';
    


    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

        $data = Semester::all();
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
        $validator = Validator::make($request->all(), Semester::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // Nom du consommable unique
        if(Semester::where('name', $request->input('name'))->get()->first()) {
            return response()->error("A semester with the same name exists, conflict", 409);
        }

        // Création de l'instance
        $ajout = new Semester();

        // On essaye d'enregistrer
        try {

            $ajout->create($request->all());
        
        } catch(\Exception $e) {
        
            return response()->error("Can't save the resource", 500);
        
        }        
        return response()->success(array("newId" => $ajout->id), 201);
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
        $res = Semester::findOrFail($id);
        
        // Validation des inputs
        $validator = Validator::make($request->all(), Semester::$rules);

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

    public function setCurrentSemester(Request $request, $id)
    {
        $new_current_semester = Semester::findOrFail($id);

        // Suppression des semestres en cours en les mettant à false
        $current_semesters = Semester::where('current', 1)->get();
        foreach ($current_semesters as $s) {
            $s->current = false;
            $s->save();
        }

        $new_current_semester->current = true;
        $new_current_semester->save();

        return response()->success();

    }
}
