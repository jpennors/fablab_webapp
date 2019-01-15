<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{

    use SoftDeletes;


    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Services';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'description', 'type', 'script_id', 'engine_id'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'        => 'required',
        'script_id'   => 'required|exists:ServiceScripts,id',
        'type'        => 'required|in:cutting,printing,other',
        'engine_id'   => 'nullable|exists:Engines,id'
    ];


    /**
    * Permet d'affecter l'instance de Service actuelle à un PurchasedElement
    * $this->purchases()->save($PurchasedElement)
    */
    public function purchases()
    {
        return $this->morphMany('App\PurchasedElement', 'purchasable');
    }


    /**
    * Retourne le script de calcul du Service
    *
    */
    public function script()
    {
        return $this->belongsTo('App\ServiceScript', 'script_id');
    }


    /**
    * Retourne la machine du Service
    *
    */
    public function engine()
    {
        return $this->belongsTo('App\Engine', 'engine_id');
    }


    /**
    * On crée un attribut pour les elements
    *
    */
    public function getScriptAttribute() {
        return $this->script()->get()->first();
    }


    /**
    * Attributs cachés
    *
    * @var array
    */
    protected $hidden = ['script_id'];

    
    /**
    * Attributs rajoutés
    *
    * @var array
    */
    protected $appends = ['script'];

}
