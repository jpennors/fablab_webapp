<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;

class CasController extends Controller
{

  	public function get(Request $request)
  	{
    	if($request->input('service')) {
      		
      		$service = $request->input('service'); 
      
      		return redirect()->away("https://cas.utc.fr/cas/login?service=" . $service);
    }
    
    	else return response()->error("Service manquant");
  
  	}
}
