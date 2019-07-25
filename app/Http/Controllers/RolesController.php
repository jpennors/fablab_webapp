<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 31/10/2017
 * Time: 18:08
 */

namespace App\Http\Controllers;


use App\Role;
use Illuminate\Http\Request;
use Log;
use Validator;

class RolesController extends Controller
{


    public static $rightName = 'role';


    public function index(){

        $data = Role::all();
        return response()->success($data);

    }


    public function store(Request $request)
    {
        // Validation des inputs 
        $validator = Validator::make($request->all(), Role::$rules);

        // Mauvaise données, erreurs
        if ($validator->fails())
            return response()->error('Mauvais inputs', 422, $validator->errors());

        // Nom du rôle unique
        if(Role::where('name', $request->input('name'))->get()->first()) {
            return response()->error("An role with the same name exists, conflict", 409);
        }

        try {
            // Création d'une nouvelle instance
            $role = new Role();
            $role->name = $request->name;
            $role->save();
            $role->permissions()->sync($request->input('permissions'));
        } catch(\Exception $e) {
            Log::debug($e);
            return response()->error('Impossible de sauver la ressource', 500);
        }

        return response()->success();
    }


    public function show($id)
    {
        $res = Role::where('id', $id)->with('permissions')->firstOrfail();
        return response()->success($res);
    }

    public function update(Request $request, $id)
    {

        // récupération du rôle
        $res = Role::findOrFail($id);

        // Validation des inputs
        $validator = Validator::make($request->all(), Role::$rules);

        // Renvoi erreur si fail
        if ($validator->fails())
            return response()->error('Mauvais inputs', 422, $validator->errors());

        // Le rôle Membre CAS ne peut changer de nom
        if ($res->name == "Membre CAS") {
            $request->merge(['name' => "Membre CAS"]);
        }

        $res->name = $request->name;
        $res->permissions()->sync($request->input('permissions'));

        try {
            $res->save();
        } catch(\Exception $e) {
            Log::debug($e);
            return response()->error('Impossible de sauver la ressource ' . $this->class, 500);
        }

        return response()->success();
    }


    public function destroy($id){

        // Récupération du rôle
        $data = Role::findOrFail($id);

        // L'éntité Fablab UTC ne peut être supprimée
        if ($data->name == "Membre CAS") {
            return response()->inputError("Impossible de supprimer le rôle Membre CAS.", 403);
        }

        // On essaye de supprimer
        try {
            $data->delete();
        } catch(\Exception $e) {
            return response()->inputError("Can't delete the resource", 500);
        }
        return response()->success();

    }

}