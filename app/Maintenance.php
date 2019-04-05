<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\EnginePart;
use App\Member;

class Maintenance extends Model
{
    //
    protected $table = 'maintenances';

    protected $fillable = [];

    public static $rules = [
        'engine_part_id' => 'required|exists:Engine_Parts,id',
        'author_id' => 'required|exists:Users,id'
    ];



  /**
   * Retourne l'auteur
   *
   */
  public function enginePart()
  {
      return $this->belongsTo('App\EnginePart');
  }

  public function author()
  {
      return $this->belongsTo('App\User');
  }

protected $appends = ['engine_part'];

    /**
    *   Attribut ajouté Engine Part
    *
    */
    public function getEnginePartAttribute(){

        $enginepart = $this->enginepart()->get();

        if ($enginepart) {
            return $enginepart->first();
        }
            else {
            return null;
        }
    }
}
