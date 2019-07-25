<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Task;
use App\Member;

class TasksController extends Controller
{

    public static $rightName = 'task';


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Task::with('author')->get();
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
      $validator = Validator::make($request->all(), Task::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      // On vérifie que la Task n'existe pas déjà
      if(Task::where('name', $request->input('name'))->get()->first()) {
        return response()->error("The Task already exists, conflict", 409);
      }

      //Création de l'instance
      $task = new Task();
      $task->author()->associate(Member::findOrFail($request->input('author_id')));
      $task->name = $request->input('name');
      $task->description = $request->input('description');
      $task->deadline_date = $request->input('deadline_date');
      $task->percents_realized = $request->input('percents_realized');

      // On essaye d'enregistrer
      try {
        $task->save();
      } catch(\Exception $e) {
        return response()->inputError("Can't save the resource", 500);
      }

      return response()->success($task);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $task = Task::findOrFail($id);
      return response()->success($task);
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
      $task = Task::findOrFail($id);
      $validator = Validator::make($request->all(), Task::$rules);

      // Mauvaises données, on retourne les erreurs
      if($validator->fails()) {
        return response()->inputError($validator->errors(), 422);
      }

      $task->author()->associate(Member::findOrFail($request->input('author_id')));
      $task->name = $request->input('name');
      $task->description = $request->input('description');
      $task->deadline_date = $request->input('deadline_date');
      $task->percents_realized = $request->input('percents_realized');

      // On essaye d'enregistrer
      try {
        $task->save();
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
      $task = Task::findOrFail($id);

      // On essaye de supprimer
      try {
        $task->delete();
      } catch(\Exception $e) {
        return response()->inputError("Can't delete the resource", 500);
      }

      return response()->success();
    }
}
