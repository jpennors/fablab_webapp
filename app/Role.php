<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Role extends Model
{

    use SoftDeletes;


    protected $fillable = [
        'name',
    ];


    /**
    * Rules pour Validator
    *
    * @var array
    */
    public static $rules = [
        'name'  =>  'required'
    ];


    protected $dates = ['deleted_at'];


    public function users()
    {
        return $this->hasMany('App\User', 'role_id');
    }


    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }


    public function hasPermission($permission)
    {
        $permissionSlugs = array_column($this['permissions']->toArray(), 'slug');

        return in_array($permission, $permissionSlugs);
    }


    public function hasAccess(array $permissions)
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

}
