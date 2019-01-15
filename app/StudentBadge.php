<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Ginger;


class StudentBadge extends Model
{
    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'student_badges';


    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['login'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'login'        => 'string|required',
    ];


    protected $dates = ['created_at'];


    protected $appends = ['user'];


    /**
    *	Retourne les informations d'un utilisateur à partir de son login
    */
    public function getUserAttribute(){
    	return Ginger::getUser($this->login);
    }
}
