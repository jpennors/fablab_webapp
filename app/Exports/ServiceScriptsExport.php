<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use App\ServiceScript;

class ServiceScriptsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    public function collection()
    {
    	$data = ServiceScript::all();
    	foreach ($data as $s) {

    		// Remove some useless rows
    		unset($s["id"]);
    		unset($s["updated_at"]);
    		unset($s["created_at"]);
    		unset($s["deleted_at"]);
    	}
    	return $data;
    }

    // HEADERS
    public function headings(): array {
    	return [
    		'Nom',
    		'Description',
    		'Script',
    		'Args'
    	];
    }
}

