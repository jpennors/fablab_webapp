<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Room;


class RoomsController extends Controller
{

    public static $rightName = 'room';
    
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Room::with('wardrobes')->get();
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
      $validator = Validator::make($request->all(), Room::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      // On vérifie que la Room n'existe pas déjà
      if(Room::where('name', $request->input('name'))->get()->first()) {
        return response()->error("The Room already exists, conflict", 409);
      }

      //Création de l'instance
      $room = new Room();
      $room->name = $request->name;
      $room->description = $request->description;

      // On essaye d'enregistrer
      try {
        $room->save();
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
        $room = Room::findOrFail($id)->with('wardrobes')->get();
        return response()->success($room);
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
        // Récupération de la salle
        $room = Room::findOrFail($id);

        // Validation des inputs
        $validator = Validator::make($request->all(), Room::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        $room->name = $request->name;
        $room->description = $request->description;

        // On essaye d'enregistrer
        try {
            $room->save();
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
        $room = Room::findOrFail($id);

        $room->deleteRelatedRelationship();

        // On essaye de supprimer
        try {
            $room->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }

        return response()->success();
    
    }
}
