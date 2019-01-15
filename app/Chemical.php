<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Nanigans\SingleTableInheritance\SingleTableInheritanceTrait;


class Chemical extends Tool
{


    /**
    * Nanigans: type de la classe actuelle (la classe fille, ici chemical)
    *
    * @var string
    */
    protected static $singleTableType = 'chemical';


    protected $dates = ['expiryDate', 'dateOfPurchase'];

  
    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['toxicity', 'expiryDate', 'dateOfPurchase'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'expiryDate'        =>  'date',
        'dateOfPurchase'	=>  'date',
    ];

}
