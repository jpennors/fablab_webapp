<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use App\Tool;

class ToolsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    public function collection()
    {
    	$data = Tool::all();
    	foreach ($data as $tool) {
    		// Add name of wardrobe_id and room_id
            if ($tool->room()->get()->count() > 0) {
                $tool["room"] = $tool->room()->get()->first()->name;
            } else {
                $tool["room"] = "";
            }
            if ($tool->wardrobe()->get()->count() > 0) {
                $tool["wardrobe"] = $tool->wardrobe()->get()->first()->name;
            } else {
                $tool["wardrobe"] = "";
            }        
    		// Remove some useless rows
    		unset($tool["id"]);
    		unset($tool["wardrobe_id"]);
    		unset($tool["room_id"]);
    		unset($tool["updated_at"]);
    		unset($tool["created_at"]);
    		unset($tool["deleted_at"]);
    	}
    	return $data;
    }

    // HEADERS
    public function headings(): array {
    	return [
            'Type',
    		'Nom',
    		'Description',
    		'Image',
    		'Fournisseur',
    		'Unité',
    		'Quantité',
    		'Quantité minimale',
            'Toxicité',
            "Date d'expiration",
            "Date d'achat",
            'Salle',
            'Etagère'
    	];
    }
}

