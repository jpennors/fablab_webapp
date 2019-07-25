<?php

namespace App\Http\Middleware;

use Gate;
use Payutc;
use Auth;
use Closure;
use App\User;
use JWTAuth;

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

        try {

            // Get token and decode it
            $payload = JWTAuth::parseToken()->getPayload();
            $user_id = $payload->get('user_id');
            $session_id = $payload->get('session_id');

            // Retrieve User from token
            $user = User::find($user_id);

            if ($user) {
            
                $request->attributes->add(['token' => JWTAuth::getToken()]);
                Auth::login($user);
                Payutc::setSessionId($session_id);

                return $next($request);
            
            } else {

                \Log::info("401, unauthorized, token not recognized");
                return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);
            
            }
        
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            // Le token est expiré
            \Log::info("401, unauthorized, token expired");
            return response()->json(array("error" => "401, unauthorized, token expired"), 401);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            // Le token n'est pas reconnu
              \Log::info("401, unauthorized, token not recognized");
              return response()->json(array("error" => "401, unauthorized, token not recognized"), 401);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {

            // Absence du header Authorization
            \Log::info("401, unauthorized, token not provided");
            return response()->json(array("error" => "401, unauthorized, token not provided"), 401);
        
        }
    }
}
