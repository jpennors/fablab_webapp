<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

use App\Maintenance;
use App\EnginePart;
use App\Member;


class MaintenancesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Maintenance::with('author')->get();
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
        $validator = Validator::make($request->all(), Maintenance::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        //Création de l'instance
        $maintenance = new Maintenance();
        $maintenance->enginepart()->associate(EnginePart::findOrFail($request->input('engine_part_id')));
        $maintenance->author()->associate(Member::findOrFail($request->input('author_id')));
        $maintenance->deadline_date = $request->input('deadline_date');
        $maintenance->description = $request->input('description');
        $maintenance->percents_realized  = $request->input('percents_realized');

        // On essaye d'enregistrer
        try {
            $maintenance->save();
        } catch(\Exception $e) {
            return response()->inputError("Can't save the resource", 500);
        }

        return response()->success(array("newId" => $maintenance->id), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        return response()->success($maintenance);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
