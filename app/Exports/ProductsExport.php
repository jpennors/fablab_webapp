<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use App\Product;

class ProductsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStrictNullComparison
{

    public function collection()
    {
    	$data = Product::all();
    	foreach ($data as $product) {
    		// Add name of categorie_id, wardrobe_id and room_id
            if ($product->room()->get()->count() > 0) {
                $product["room"] = $product->room()->get()->first()->name;
            } else {
                $product["room"] = "";
            }
            if ($product->wardrobe()->get()->count() > 0) {
                $product["wardrobe"] = $product->wardrobe()->get()->first()->name;
            } else {
                $product["wardrobe"] = "";
            }
            if ($product->categorie()->get()->count() > 0) {
                $product["categorie"] = $product->categorie()->get()->first()->name;
            } else {
                $product["categorie"] = "";
            }
    		// Remove some useless rows
    		unset($product["id"]);
    		unset($product["categorie_id"]);
    		unset($product["wardrobe_id"]);
    		unset($product["room_id"]);
    		unset($product["updated_at"]);
    		unset($product["created_at"]);
    		unset($product["deleted_at"]);
    	}
    	return $data;
    }

    // HEADERS
    public function headings(): array {
    	return [
    		'Nom',
    		'Description',
    		'Image',
    		'Prix',
    		'Unité',
    		'Quantité',
    		'Quantité minimale',
    		'Marque',
    		'Fournisseur',
    		'Lien fournisseur',
    		'Documentation',
    		'Fiche technique',
    		'Salle',
    		'Etagère',
            'Catégorie'
    	];
    }
}

