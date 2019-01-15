<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Product;

class Categorie extends Model
{
    

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'categories';


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
        'name' => 'required',
    ];

    
    /**
    * Retourne les produits liés à la catégorie
    *
    */
    public function products()
    {
        return $this->hasMany('App\Product');
    }

}
