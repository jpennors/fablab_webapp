<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Room;
use App\Tool;

class Wardrobe extends Model
{

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Wardrobes';

 
    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name'];

 
    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'      => 'required',
        'room_id'   => 'required|exists:Rooms,id'
    ];

 
    protected $dates = ['deleted_at'];

   
    /**
    * Retourne la Room de la Wardrobe actuelle
    *
    */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }


    /**
    * Retourne les Tools de la Wardrobe actuelle
    *
    */
    public function tools()
    {
        return $this->hasMany('App\Tool');
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
    * Retourne les Products de la Room actuelle
    *
    */
    public function products()
    {
        return $this->hasMany('App\Product');
    }


    /**
    *   Suppression de toutes les relations liées à cette étagère
    *
    */
    public function deleteRelatedRelationship(){
        
        // Expendables
        $this->deleteExpendablesRelationship();

        // Produits
        $this->deleteProductsRelationship();

        // Outils
        $this->deleteToolsRelationship();
    }


    /**
    *      Suppression des relations Expendables avec cette salle
    *
    */
    public function deleteExpendablesRelationship(){

        $expendables = $this->expendables()->get();

        foreach ($expendables as $expendable) {
            $expendable->setWardrobeidNull();
        }
    }


    /**
    *      Suppression des relations Outils avec cette salle
    *
    */
    public function deleteToolsRelationship(){

        $tools = $this->tools()->get();

        foreach ($tools as $tool) {
            $tool->setWardrobeidNull();
        }
    }


    /**
    *      Suppression des relations Outils avec cette salle
    *
    */
    public function deleteProductsRelationship(){

        $products = $this->products()->get();

        foreach ($products as $product) {
            $product->setWardrobeidNull();
        }
    }

}
