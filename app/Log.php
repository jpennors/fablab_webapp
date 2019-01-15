<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property \Carbon\Carbon $created_at
 * @property int $id
 * @property \Carbon\Carbon $updated_at
 */
class Log extends Model
{
  /**
   * The table associated with the model.
   *
   * @var string
   */
  protected $table = 'Logs';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ['token', 'CAS', 'disabled', 'payutc_sessionid'];

  /**
   * Modèlise le lien 1:n entre Log et Member.
   *
   */
  public function member() {
    return $this->belongsTo('App\User', 'user_id');
  }

}
