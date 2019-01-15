<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;

class ResponseMacroServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {

      // Pour les succès en général
      Response::macro('success', function ($data = [], $status = 200) {
        $json = array("meta" => array("status" => $status, "message" => "OK"),
                      "data" => $data);
        return Response::json($json, $status);
      });

      // Pour les erreurs en général
      Response::macro('error', function ($message, $status = 400, $data = []) {
        $json = array("meta" => array("status" => $status, "message" => $message),
                      "data" => $data);
        return Response::json($json, $status);
      });

      // Pour les erreurs d'input
      Response::macro('inputError', function ($errors, $status = 422) {
        $json = array("meta" => array("status" => $status, "message" => "Bad inputs"),
                      "data" => $errors);
        return Response::json($json, $status);
      });

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
