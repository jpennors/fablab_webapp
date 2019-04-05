<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Gate;
use JWTFactory;
use JWTAuth;

/**
 * This class try to check permission for requiring ressource based
 * on the '$rightName' static property filled in the controller.
 * @package App\Http\Middleware
 */
class FablabAdmin
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
  
        if(!($member = Auth::user())) {
            return response()->error("401, unauthorized, user must be present in session.", 401);
        }
        if(!Gate::check('login')) {
            return response()->error("401, unauthorized, user doesn't have the 'login' permission.", 401);
        }


        $action = $request->route()->getAction();
        $action = explode('@', $action['controller']);

        // Check for const $rightName in class $action[0]
        if (isset($action[0]::$rightName)) {
            try {
                $permission = $this::mapRouteToPermission($action[0]::$rightName, $action[1]);

                if (Gate::check($permission)) {
                    return $next($request);
                } else {
                    return response()->error("Vous n'êtes pas autorisé à accéder à cette ressource.", 403);
                }
            } catch (\InvalidArgumentException $e) {
            }
        }
        // otherwise, we skip checking for permissions
        return $next($request);
    }

    /**
     * Map route names to permission names
     * @param $resource
     * @param $action
     * @return string
     * @throws \InvalidArgumentException when $action is not a permission name
     */
    private static function mapRouteToPermission($resource, $action)
    {
        $map = [
            'index'   => 'list',
            'show'    => 'list',
            'store'   => 'add',
            'update'  => 'edit',
            'destroy' => 'delete',
            'uploadImage' => 'edit'
        ];

        if (!isset($map[$action])) {
            throw new \InvalidArgumentException("Action $action does not exist in permission name");
        }

        return $map[$action].'-'.$resource;
    }
}
