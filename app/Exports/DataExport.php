<?php

namespace App\Exports;
use App\Printing;

use Maatwebsite\Excel\Concerns\FromCollection;

class DataExport implements FromCollection
{
    public function __construct($invoices)
    {
    	//On récupère la classe
        $this->invoices = $invoices;
    }

    public function collection()
    {
    	//On renvoie les données
        return $this->invoices::all();
    }
}