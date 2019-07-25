<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{


    use SoftDeletes;


    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Rooms';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = [];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name' => 'required'
    ];


    protected $dates = ['deleted_at'];


    /**
    * Retourne les Engines de la Room actuelle
    *
    */
    public function engines()
    {
        return $this->hasMany('App\Engine');
    }


    /**
    * Retourne les Engines de la Room actuelle
    *
    */
    public function expendables()
    {
        return $this->hasMany('App\Expendable');
    }


    /**
    * Retourne les Wardrobes de la Room actuelle
    *
    */
    public function wardrobes()
    {
        return $this->hasMany('App\Wardrobe');
    }


    /**
    * Retourne les Tools de la Room actuelle
    *
    */
    public function tools()
    {
        return $this->hasMany('App\Tool');
    }


    /**
    * Retourne les Products de la Room actuelle
    *
    */
    public function products()
    {
        return $this->hasMany('App\Product');
    }


    /**
    *   Suppression de toutes les relations liées à cette salle
    *
    */
    public function deleteRelatedRelationship(){

        // Machines
        $this->deleteEnginesRelationship();
        
        // Expendables
        $this->deleteExpendablesRelationship();

        // Produits
        $this->deleteProductsRelationship();

        // Outils
        $this->deleteToolsRelationship();

        // Wardrobes
        $this->deleteRelatedWardrobes();
    }


    /**
    *      Suppression des relations Engines avec cette salle
    *
    */
    public function deleteEnginesRelationship(){

        $engines = $this->engines()->get();

        foreach ($engines as $engine) {
            $engine->setRoomidNull();
        }
    }


    /**
    *      Suppression des relations Expendables avec cette salle
    *
    */
    public function deleteExpendablesRelationship(){

        $expendables = $this->expendables()->get();

        foreach ($expendables as $expendable) {
            $expendable->setRoomidNull();
        }
    }


    /**
    *      Suppression des relations Outils avec cette salle
    *
    */
    public function deleteToolsRelationship(){

        $tools = $this->tools()->get();

        foreach ($tools as $tool) {
            $tool->setRoomidNull();
        }
    }


    /**
    *      Suppression des relations Outils avec cette salle
    *
    */
    public function deleteProductsRelationship(){

        $products = $this->products()->get();

        foreach ($products as $product) {
            $product->setRoomidNull();
        }
    }


    /**
    *      Suppression des Wardrobes associées
    *
    */
    public function deleteRelatedWardrobes(){

        $wardrobes = $this->wardrobes()->get();

        foreach ($wardrobes as $wardrobe) {
            $wardrobe->delete();
        }
    }


    /**
    *       Attribut ajouté
    *
    */
    protected $appends = ['wardrobes'];


    /**
    *       Renvoie les étagères associées
    *
    */
    public function getWardrobesAttribute(){

        $wardrobes = $this->wardrobes()->get();
        return $wardrobes;

    }

}

