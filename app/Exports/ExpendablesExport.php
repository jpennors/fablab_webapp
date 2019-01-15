<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use App\Expendable;

class ExpendablesExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    public function collection()
    {
    	$data = Expendable::all();
    	foreach ($data as $expendable) {
    		// Add name of wardrobe_id and room_id
            if ($expendable->room()->get()->count() > 0) {
                $expendable["room"] = $expendable->room()->get()->first()->name;
            } else {
                $expendable["room"] = "";
            }
            if ($expendable->wardrobe()->get()->count() > 0) {
                $expendable["wardrobe"] = $expendable->wardrobe()->get()->first()->name;
            } else {
                $expendable["wardrobe"] = "";
            }
    		// Remove some useless rows
    		unset($expendable["id"]);
    		unset($expendable["wardrobe_id"]);
    		unset($expendable["room_id"]);
    		unset($expendable["updated_at"]);
    		unset($expendable["created_at"]);
    		unset($expendable["deleted_at"]);
    	}
    	return $data;
    }

    // HEADERS
    public function headings(): array {
    	return [
    		'Nom',
            'Marque',
            'Fournisseur',
            'Lien fournisseur',
    		'Unité',
    		'Quantité',
    		'Quantité minimale',
            'Description',
            'Image',
    		'Salle',
    		'Etagère'
    	];
    }
}

