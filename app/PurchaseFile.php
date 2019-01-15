<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PurchaseFile extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'purchase_files';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['purchased_id', 'nom'];

    /**
     * Rules pour Validator
     *
     * @var array
     */
    public static $rules = [
        'purchased_id' => 'required|exists:PurchasedElement,id',
        'nom' => 'required'
    ];
}
