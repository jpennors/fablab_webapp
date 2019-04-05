<?php

use Illuminate\Database\Seeder;
use App\Tool;
use App\Chemical;

class ToolsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        if (env('APP_ENV') != 'production') {

            $h = new Tool();
            $h->type = 'tool';
            $h->name = "Clé à molette";
            $h->description = "Ben une clé quoi !";
            $h->picture = NULL;
            $h->wardrobe_id = 89;
            $h->room_id = 2;
            $h->remainingQuantity = 4;
            $h->minQuantity = 2;
            $h->quantityUnit = "unité";
            $h->supplier = "fournisseur";
            $h->save();

            $h = new Chemical();
            $h->type = 'chemical';
            $h->name = "TNT";
            $h->description = "Boom";
            $h->picture = NULL;
            $h->room_id = 2;
            $h->wardrobe_id = 96;
            $h->remainingQuantity = 9;
            $h->minQuantity = 8;
            $h->quantityUnit = "unité";
            $h->toxicity = "Importante";
            $h->expiryDate = '2018-05-01';
            $h->dateOfPurchase = '2016-09-05';
            $h->supplier = "NSA";
            $h->save();

            $h = new Tool();
            $h->name = "Lance-patate";
            $h->description = "C'est plutot cool mais c'est inutile.";
            $h->picture = NULL;
            $h->room_id = 1;
            $h->remainingQuantity = 4;
            $h->minQuantity = 2;
            $h->quantityUnit = "unité";
            $h->save();

        }
    }
}
