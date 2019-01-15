<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 14/11/2017
 * Time: 11:16
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Service;
use App\ServiceScript;
use App\Engine;
use Validator;

class ServicesController extends Controller
{

    public static $rightName = 'service';


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Service::all();
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
        $validator = Validator::make($request->all(), Service::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On vérifie que le service n'existe pas déjà
        if(Service::where('name', $request->input('name'))->get()->first()) {
            return response()->error("Un service avec le même nom existe déjà", 409);
        }

        // Création de l'instance
        $res = new Service();
        $res->name = $request->input('name');
        $res->description = $request->input('description');
        $res->type = $request->input('type');
        $res->script()->associate(ServiceScript::find($request->input('script_id')));
        $res->engine_id = $request->input('engine_id');

        // On essaye d'enregistrer
        try {
            $res->save();
        } catch(\Exception $e) {
            return response()->error("Can't save the resource", 500);
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
        $data = Service::findOrFail($id);
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
        $res = Service::findOrFail($id);
        $validator = Validator::make($request->all(), Service::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On met à jour
        $res->name = $request->input('name');
        $res->description = $request->input('description');
        $res->type = $request->input('type');
        $res->script()->associate(ServiceScript::find($request->input('script_id')));
        $res->engine_id = $request->input('engine_id');

        // On essaye d'enregistrer
        try {
            $res->save();
        } catch(\Exception $e) {
            return response()->error("Can't update the resource", 500);
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
        $data = Service::findOrFail($id);

        // On essaye de supprimer
        try {
            $data->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }

        return response()->success();
    }
}