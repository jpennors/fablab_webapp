<?php

namespace App\Http\Controllers;

use App\Categorie;


class CategoriesController extends Controller
{

    public function index()
    {
        
        $data = Categorie::all();
        return response()->success($data);
    
    }

}
