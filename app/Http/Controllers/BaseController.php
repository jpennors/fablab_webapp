<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Validator;
use Schema;
use Log;

abstract class BaseController extends Controller
{
  /**
   * Model class à gérer via le CRUD
   *
   * @var class
   */
  protected $class;

  /**
   * Règles pour validator de la class
   *
   * @var array
   */
  protected $rules = [];

  /**
   * Constructeur
   *
   * @param class
   */
  public function __construct()
  {
    $className = $this->configureResourceClass();
    if(class_exists($className)) {
      $this->class = $className;
      if(property_exists($className, 'rules'))
        $this->rules = get_class_vars($className)['rules'];
    } else {
        throw new \InvalidArgumentException("Class $className doesn't exist");
    }
  }

  /**
   * Configure the associated class to this controller
   * @return string
   */
  abstract public function configureResourceClass();

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    if ($this::$rightName) {
        $this->authorize('list-'.$this::$rightName);
    }
    $res = call_user_func(array($this->class, 'all'));
    return response()->success($res);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    if ($this::$rightName) {
        $this->authorize('add-'.$this::$rightName);
    }
    $validator = Validator::make($request->all(), $this->rules);

    if ($validator->fails())
          return response()->error('Mauvais inputs', 422, $validator->errors());

    $res = new $this->class();

    // On récupère la liste de toutes les colonnes
    $properties = Schema::getColumnListing($res->getTable());

    // Pour chaque colonne de la table, on regarde si la propriété a été transmise
    foreach($properties as $p) {
      if($request->input($p) && $p != 'id') // On ne s'occupe pas de l'id
        $res[$p] = $request->input($p);
    }

    try {
      $res->save();
    } catch(\Exception $e) {
      Log::debug($e);
      return response()->error('Impossible de sauver la ressource ' . $this->class, 500);
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
    $res = call_user_func(array($this->class, 'findOrFail'), [$id])->first();
    return response()->success($res);
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
    if ($this::$rightName) {
        $this->authorize('edit-'.$this::$rightName);
    }
    $res = call_user_func(array($this->class, 'findOrFail'), [$id])->first();

    $validator = Validator::make($request->all(), $this->rules);

    if ($validator->fails())
          return response()->error('Mauvais inputs', 422, $validator->errors());

    // On récupère la liste de toutes les colonnes
    $properties = Schema::getColumnListing($res->getTable());

    // Pour chaque colonne de la table, on regarde si la propriété a été transmise
    foreach($properties as $p) {
      if($request->input($p) && $p != 'id') // On ne s'occupe pas de l'id
        $res[$p] = $request->input($p);
    }

    try {
      $res->save();
    } catch(\Exception $e) {
      Log::debug($e);
      return response()->error('Impossible de sauver la ressource ' . $this->class, 500);
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
    if ($this::$rightName) {
        $this->authorize('delete-'.$this::$rightName);
    }
    $res = call_user_func(array($this->class, 'findOrFail'), [$id])->first();

    try {
      $res->delete();
    } catch(\Exception $e) {
      return response()->error('Impossible de supprimer la ressource ' . $this->class, 500);
    }

    return response()->success();
  }
}
