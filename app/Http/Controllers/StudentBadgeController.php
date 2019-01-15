<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\StudentBadge;
use Validator;

class StudentBadgeController extends Controller
{
    public static $rightName = 'student_badge';
    
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = StudentBadge::all();
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
      $validator = Validator::make($request->all(), StudentBadge::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      //Création de l'instance
      $s = new StudentBadge();
      $s->login = $request->login;

      // On essaye d'enregistrer
      try {
        $s->save();
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
        $s = StudentBadge::findOrFail($id);
        return response()->success($s);
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
        // Récupération de l'objet
        $s = StudentBadge::findOrFail($id);

        // Validation des inputs
        $validator = Validator::make($request->all(), StudentBadge::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        $s->login = $request->login;

        // On essaye d'enregistrer
        try {
            $s->save();
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
        // Récupération de la salle
        $s = StudentBadge::findOrFail($id);

        // On essaye de supprimer
        try {
            $s->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }

        return response()->success();
    
    }
}
