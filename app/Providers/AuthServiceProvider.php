<?php

namespace App\Providers;

use App;
use App\Permission;
use Gate;
use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{

    /**
     * Register any application authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        //
    }

    public function registerPolicies()
    {
        if(App::runningInConsole()){
          return null;
        }

        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            Gate::define($permission->slug, function ($user) use ($permission) {
                return $user->hasAccess([ $permission->slug ]);
            });
        }
    }
}
