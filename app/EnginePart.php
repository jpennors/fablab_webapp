<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Engine;
use App\Maintenance;

class EnginePart extends Model
{

    use SoftDeletes;


     /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'engine_parts';

    /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ['name', 'description', 'engine_id', 'time_to_maintenance', 'next_maintenance', 'need_maintenance'];

  /**
   * Rules pour Validator
   *
   * @var array
   */
  public static $rules = [
    'name'                  =>  'required|string',
    'engine_id'             =>  'required|integer|exists:Engines,id',
    'time_to_maintenance'   =>  'required|integer',
    'need_maintenance'      =>  'boolean'
  ];

  /**
   * Retourne l'Engine de la Part actuelle
   *
   */
  public function engine()
  {
      return $this->belongsTo('App\Engine');
  }

  /**
    *       Attribut ajouté
    *
    */
    protected $appends = ['engine'];


    /**
    *   Attribut ajouté Room
    *
    */
    public function getEngineAttribute(){

        $engines = $this->engine()->get();

        if ($engines) {
            return $engines->first();
        }
         else {
            return null;
        }
    }


    /**
     * Décrémente le nombre d'heures restantes d'un epièce
     */
    public function usedEnginePart($time){

        // On décrémente
        $this->next_maintenance -= $time;

        if($this->next_maintenance <= 0) {

          $this->next_maintenance += $this->time_to_maintenance;
          $this->need_maintenance = true;

        }


        
        $this->save();        
    }


}
