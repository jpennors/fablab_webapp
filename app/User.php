<?php

namespace App;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ginger;

/**
 * @property \Carbon\Carbon $deleted_at
 */
class User extends Model implements Authenticatable
{

    use SoftDeletes;


    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'Users';


    /**
     * The ginger infos
     *
     * @var \stdClass
     */
    protected $ginger = null;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'login',
        'role_id',
        'terms',
        'active',
        'entity_id',
    ];


    /** Attributs rajoutés
     *
     * @var array
     */
    protected $appends = ['firstName', 'lastName', 'email', 'status', 'isAdulte', 'isCotisant'];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'login' => 'required',
        'terms' => 'required|boolean',
        'role_id' => 'required|exists:roles,id',
        'entity_id' => 'exists:Entity,id',
    ];


    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'terms' => 'boolean',
        'active' => 'boolean',
    ];


    public function loadFromGinger()
    {
        if (!$this->login) {
            throw new \Exception("Login should be filled");
        }
        $response = Ginger::getUser($this->login);
        if ($response->status == 200){
            $this->ginger = $response->content;
        }
    }

    public function getFirstNameAttribute()
    {
        $this->loadFromGinger();
        return $this->ginger->prenom;
    }

    public function getLastNameAttribute()
    {
        $this->loadFromGinger();
        return $this->ginger->nom;
    }

    public function getEmailAttribute()
    {
        $this->loadFromGinger();
        return $this->ginger->mail;
    }

    public function getStatusAttribute()
    {
        $this->loadFromGinger();
        switch ($this->ginger->type) {
            case 'etu':
                return 'étudiant';
                break;
            case 'pers':
                return 'personnel';
                break;
            case 'escom':
                return 'étudiant ESCOM';
                break;
            case 'escompers':
                return 'personnel ESCOM';
                break;
            case 'ext':
                return 'extérieur';
                break;
            default:
                return 'autre';
        }
    }

    public function getIsCotisantAttribute()
    {
        $this->loadFromGinger();
        return $this->ginger->is_cotisant;
    }

    public function getIsAdulteAttribute()
    {
        $this->loadFromGinger();
        return $this->ginger->is_adulte;
    }

    public function role()
    {
        return $this->belongsTo('App\Role', 'role_id');
    }

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function hasAccess(array $permissions)
    {
        return $this->role->hasAccess(['super-admin']) || $this->role->hasAccess($permissions);
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'login';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this['login'];
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return null;
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @return string
     */
    public function getRememberToken()
    {
        return false;
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param  string $value
     * @return void
     */
    public function setRememberToken($value)
    {
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return null;
    }
}
