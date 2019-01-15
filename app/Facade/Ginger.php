<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 30/11/2017
 * Time: 15:07
 */

namespace App\Facade;


use Illuminate\Support\Facades\Facade;

class Ginger extends Facade
{
    protected static function getFacadeAccessor()
    {
        return "GingerClient";
    }
}