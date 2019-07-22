<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'semesters';

 
    /**
    * The attributes that are mass assignable.
    *
    * @var array
    */
    protected $fillable = ['name', 'current'];

 
    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'      => 'required',
    ];


    /**
     * Méthode pour obtenir le semestre courant
     */
    public static function getCurrentSemester()
    {
        return Semester::where('current', 1)->get()->first();
    }


    /**
     * Méthode pour savoir quel semestre utilisé en base de données
     * Dépend du semestre courant et de l'envoi ou non d'un id de semestre
     * dans les paramètres de la request
     * 
     */

     public static function getSemesterToUse($request_parameter_semester)
     {  
        if ($request_parameter_semester) {
            $semester_id = Semester::findOrFail($request_parameter_semester); 
            return $semester_id;   
        }

        $semester = Semester::getCurrentSemester();
        return $semester->id;

     }


}
