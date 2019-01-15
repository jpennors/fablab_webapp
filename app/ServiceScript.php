<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ServiceScript extends Model
{

    use SoftDeletes;

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'ServiceScripts';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'description', 'script', 'args'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'        => 'required|string',
        'description' => 'required|string',
        'script'      => 'required|string',
    ];


    protected $dates = ['deleted_at'];

}
