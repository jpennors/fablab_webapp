<?php

namespace App\Http\Middleware;

use Gate;
use Payutc;
use Auth;
use Closure;
use App\Log;

class UTCAuth
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

      if($request->header("Authorization-fablab")) {

        // Récupère l'User associé au token
        $token = $request->header("Authorization-fablab");
        $log = Log::where('token', $token)->get();

        if($log->first()) {

          // Le token existe dans la table
          $log = $log->first();

          // Vérifie que le token n'est pas désactivé ou expiré
          // Le token expire au bout de 'dt' heures.
          $dt = 10;

          if((time() - $log->created_at->timestamp < $dt*60*60) && !$log->disabled) {
            $request->attributes->add(['token' => $token]);
            Auth::login($log->member);
            Payutc::setSessionId($log['payutc_sessionid']);

            return $next($request);
          }
          else {
            // Le token est expiré
            \Log::info("401, unauthorized, token expired");
            return response()->json(array("error" => "401, unauthorized, token expired"), 401);
          }

        }
        else {
          // Le token n'existe pas dans la table
          \Log::info("401, unauthorized, token not recognized");
          return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
        }

      }
      else {
        // Absence du header Authorization
        \Log::info("401, unauthorized, token not provided");
        return response()->json(array("error" => "401, unauthorized, token not provided"), 401);
      }
    }
}
