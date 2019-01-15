<?php

namespace App\Http\Middleware;

use Closure;

class FablabClient
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        // On récupère la clé du Fablab
        $fablab_key = env('FABLAB_APP_KEY');

        if ($fablab_key == $request->query("key")) {
        
            return $next($request);

        } else {
            
            // La key n'est pas valide
            \Log::info("401, unauthorized, key not recognized");
            return response()->json(array("error" => "401, unauthorized, key not recognized"), 401);
        
        }
    }
}
