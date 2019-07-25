<?php

namespace App\Http\Controllers;

use App\ServiceScript;
use Illuminate\Http\Request;
use Validator;
use App\Exports\ServiceScriptsExport;
use Excel;

class ServiceScriptsController extends Controller
{
    
    public static $rightName = 'price';

    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = ServiceScript::all();
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
        $validator = Validator::make($request->all(), ServiceScript::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
        }

        // On vérifie que la Room n'existe pas déjà
        if(ServiceScript::where('name', $request->input('name'))->get()->first()) {
            return response()->error("La fonction de prix existe déjà", 409);
        }

        //Création de l'instance
        $s = new ServiceScript();
        $s->name = $request->input('name');
        $s->description = $request->input('description');
        $s->script = $request->input('script'); 
        
        // JSON Encode of args argument
        $this->argsToJSON($request);
        $s->args = $request->input('args');


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
        $s = ServiceScript::findOrFail($id);
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
        $s = ServiceScript::findOrFail($id);
        $validator = Validator::make($request->all(), ServiceScript::$rules);

        // Mauvaises données, on retourne les erreurs
        if($validator->fails()) {
            return response()->inputError($validator->errors(), 422);
        }

        // On met à jour
        $s->name = $request->input('name');
        $s->description = $request->input('description');
        $s->script = $request->input('script'); //A modifier plus tard

        // JSON Encode of args argument
        $this->argsToJSON($request);
        $s->args = $request->input('args');

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
      $s = ServiceScript::findOrFail($id);

      // On essaye de supprimer
      try {
        $s->delete();
      } catch(\Exception $e) {
        return response()->inputError("Can't delete the resource", 500);
      }

      return response()->success();
    }

   
    /**
    * Transforme les arguments qui arrivent sous forme d'Array PHP, en JSON
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    private function argsToJSON(Request $request)
    {
        if($request->input('args'))
            $request->merge(array('args' => json_encode($request->input('args'))));
        else
            $request->merge(array('args' => "[]"));
        return $request;
    }


    /*
    *
    * EXPORT / IMPORT
    *
    */

    public function exportFile()
    {
        $this->authorize('export-data');
        
        return Excel::download(new ServiceScriptsExport('App\ServiceScript'), 'data.xlsx');
    
    }

    public function importSave(Request $newScripts){

        $this->authorize('import-data');

        foreach ($newScripts->data as $newScript) {
            
            // Validation des inputs
            $validator = Validator::make($newScript, ServiceScript::$rules);
            
            // Mauvaises données, on retourne les erreurs
            if($validator->fails()) {
                $validator->errors()->add("L'erreur porte sur l'item", $newScript["name"]);
                return response()->inputError($validator->errors(), 422);
            }
        }

        $scripts = ServiceScript::all();
        
        foreach ($scripts as $script) {
            $this->destroy($script->id);
        }

        foreach ($newScripts->data as $newScript) {

            //On vérifie si la combinaison id et nom n'est pas également a un élément dans la bdd
            $s = ServiceScript::withTrashed()->where('name', $newScript['name'])->get()->first();

            if($s){
                $s->restore();
                $s->update($newScript);
            }
            else{
                $request = new Request($newScript);
                $this->store($request);
            }
        }
    }


}
