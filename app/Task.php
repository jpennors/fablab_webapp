<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Member;

class Task extends Model
{
 
    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Tasks';


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
        'name'      => 'required',
        'author_id' => 'required|exists:Users,id'
    ];


    /**
    * Retourne l'auteur
    *
    */
    public function author()
    {
        return $this->belongsTo('App\User');
    }
}
