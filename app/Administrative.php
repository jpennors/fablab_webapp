<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Administrative extends Model
{

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Administratives';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['key', 'desc', 'value'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'key'   =>  'required|string',
        'desc'  =>  'required|string',
        'value' =>  'required|string',
    ];

}
