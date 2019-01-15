<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Categorie;


class CategoriesController extends Controller
{

    public function index()
    {
        
        $data = Categorie::all();
        return response()->success($data);
    
    }

}
