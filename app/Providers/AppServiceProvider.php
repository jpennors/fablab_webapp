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
            $required = function() {
                throw new \InvalidArgumentException("Missing GINGER_APP_KEY in '.env' file. (Run `php artisan config:clear` to update env variables)");
            };
            $appKey = env('GINGER_APP_KEY', $required);

            return new GingerClient($appKey);
        });

        App::singleton('Payutc', function() {
            $required = function() {
                throw new \InvalidArgumentException("Missing NEMOPAY_API_URL or NEMOPAY_APP_KEY or NEMOPAY_FUN_ID in '.env' file. (Run `php artisan config:clear` to update env variables)");
            };
            $apiUrl = env('NEMOPAY_API_URL', $required);
            $appKey = env('NEMOPAY_APP_KEY', $required);
            $funId = env('NEMOPAY_FUN_ID', $required);
            $proxy = env('PROXY_UTC');
            $categObjId = env('NEMOPAY_CATEGORY_OBJ_ID');
            $categServiceId = env('NEMOPAY_CATEGORY_SERVICE_ID');
            $activate = boolval(env('NEMOPAY_ACTIVATE'));

            return new Payutc($apiUrl, $appKey, $funId ,$categObjId, $categServiceId, $activate, $proxy);
        });
    }
}
