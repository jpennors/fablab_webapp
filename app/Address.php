<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{

  use SoftDeletes;

  /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'Addresses';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ['name', 'address', 'city', 'cp', 'country'];

  /**
   * Rules pour Validator
   *
   * @var array
   */
  public static $rules = [
    'name'    =>  'required|string',
    'address' =>  'required|string',
    'city'    =>  'required|string',
    'cp'      =>  'required|numeric',
    'country' =>  'required|string'
  ];


  protected $dates = ['deleted_at'];

}
