<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use App\Engine;

class EnginesExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    public function collection()
    {
    	$data = Engine::all();
    	foreach ($data as $engine) {
    		// Add name of room_id
            if ($engine->room()->get()->count() > 0) {
                $engine["room"] = $engine->room()->get()->first()->name;
            } else {
                $engine["room"] = "";
            }
    		// Remove some useless rows
    		unset($engine["id"]);
    		unset($engine["room_id"]);
    		unset($engine["updated_at"]);
    		unset($engine["created_at"]);
    		unset($engine["deleted_at"]);
    	}
    	return $data;
    }

    // HEADERS
    public function headings(): array {
    	return [
    		'Nom',
    		'Description',
    		'Image',
    		'Statut',
    		'Documentation',
    		'Fiche technique',
            'Salle'
    	];
    }
}

