<?php

namespace App;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Storage;


class Entity extends Model
{

    use SoftDeletes;


    /**
     * @inheritdoc
     */
    protected $table = 'Entity';


    /**
     * @inheritdoc
     */
    protected $fillable = ["name", "asso_number", "siren", "invoice_address", "mail", "site", "abreviation", "phone", "legals"];


    /**
     * @inheritdoc
     */
    public static $rules = [
        'name'              =>  'required',
        'abreviation'       =>  'required',
        'invoice_address'   =>  'required',
        'mail'              =>  'email',
    ];


    protected $dates = ['deleted_at'];
    

}