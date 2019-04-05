<?php

namespace App\Providers;

use App;
use App\Libraries\Payutc;
use App\Libraries\GingerClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if($this->app->environment('local')) {
            $this->app->register(\Barryvdh\Debugbar\ServiceProvider::class);
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);

            // register an alias
            $this->app->booting(function()
            {
                $loader = \Illuminate\Foundation\AliasLoader::getInstance();
                $loader->alias('Debugbar', \Barryvdh\Debugbar\Facade::class);
            });
        }

        App::singleton('GingerClient', function() {

            $appKey = config('auth.services.ginger.app_key');

            return new GingerClient($appKey);
        });

        App::singleton('Payutc', function() {

            $apiUrl = config('auth.services.payutc.url');
            $appKey = config('auth.services.payutc.app_key');
            $funId = config('auth.services.payutc.fundation');
            $proxy = config('app.proxy');
            $categObjId = config('auth.services.payutc.categories.category_obj_id');
            $categServiceId = config('auth.services.payutc.categories.category_service_id');
            $activate = config('auth.services.payutc.active');

            return new Payutc($apiUrl, $appKey, $funId ,$categObjId, $categServiceId, $activate, $proxy);
        });
    }
}
