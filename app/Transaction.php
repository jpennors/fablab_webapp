<?php

namespace App;
use App\Libraries\PayutcLinkable;

class Transaction extends PayutcLinkable
{
    
    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'Transactions';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'amount', 'purchase_id', 'session_id', 'paid'];


    /**
    * Une Transaction est rattaché à une Purchase
    *
    */
    public function purchase() {
        return $this->belongsTo('App\Purchase', 'purchase_id');
    }


    /**
     * Should return the data corresponding this object
     * @return \stdClass
     */
    public function payutcRequest($payutcId)
    {
        return null;
    }
}
