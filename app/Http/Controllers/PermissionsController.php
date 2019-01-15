<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 05/11/2017
 * Time: 16:35
 */

namespace App\Http\Controllers;


use App\Permission;

class PermissionsController extends Controller
{


    /**
     * @inherit
     */
    public static $rightName = 'permission';

    

    public function index()
    {
        
        $data = Permission::all();
        return response()->success($data);
    
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $p = Permission::findOrFail($id);
        return response()->success($p);
    
    }

}