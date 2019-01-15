<?php

use Illuminate\Database\Seeder;
use App\Product;
use App\Categorie;
//use Payutc;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
      public function run()
      {
      
            // if (env('APP_ENV') != 'production'){

                  $p = new Product();
                  $p->name = "Carte mère Arduino EX455";
                  $p->description = "Carte mère Arduino de taile 2x5cm, water-proof";
                  $p->picture = NULL;
                  $p->remainingQuantity = 4;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "unité";
                  $p->price = 15.99;
                  $p->brand = "Arduino";
                  $p->supplier = "Farnell";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Colle àbois TITEBOND III";
                  $p->description = "La Titebond est une colle à bois qui reste souple lorsqu'elle est sèche, de ce fait, lors d'une utilisation intensive, elle ne se fissurera pas comme les colles plus rigides (époxy). Il s'agit d'une colle à base d'eau, facile et plus sûr à utiliser que les colles de type époxy.";
                  $p->picture = NULL;
                  $p->remainingQuantity = 3;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "Bidon";
                  $p->price = 18;
                  $p->brand = "TITEBOND";
                  $p->supplier = "Roarockit";
                  $p->supplierLink = "www.roarocki.fr";
                  $p->documentation = "www.roarocki.fr/titebond";
                  $p->dataSheet = "Utilisation : Bois
                  Temps de séchage : 9min
                  Entretien: Ne laissez pas cette colle geler
                  Remarque: Taches";
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Lecteur NFC LG";
                  $p->description = "Lecteur NFC réf LG 12HGV0987NQSJH intégrable sur un système embarqué";
                  $p->picture = NULL;
                  $p->remainingQuantity = 1;
                  $p->minQuantity = 1;
                  $p->quantityUnit = "unité";
                  $p->price = 10;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Porte clé Fablab UTC";
                  $p->description = "Goodies";
                  $p->picture = NULL;
                  $p->remainingQuantity = 0;
                  $p->minQuantity = 4;
                  $p->quantityUnit = "unité";
                  $p->price = 2;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Carte mère Arduino EX455";
                  $p->description = "Carte mère Arduino de taile 2x5cm, water-proof";
                  $p->picture = NULL;
                  $p->remainingQuantity = 4;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "unité";
                  $p->price = 15.99;
                  $p->brand = "Arduino";
                  $p->supplier = "Farnell";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Colle àbois TITEBOND III";
                  $p->description = "La Titebond est une colle à bois qui reste souple lorsqu'elle est sèche, de ce fait, lors d'une utilisation intensive, elle ne se fissurera pas comme les colles plus rigides (époxy). Il s'agit d'une colle à base d'eau, facile et plus sûr à utiliser que les colles de type époxy.";
                  $p->picture = NULL;
                  $p->remainingQuantity = 3;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "Bidon";
                  $p->price = 18;
                  $p->brand = "TITEBOND";
                  $p->supplier = "Roarockit";
                  $p->supplierLink = "www.roarocki.fr";
                  $p->documentation = "www.roarocki.fr/titebond";
                  $p->dataSheet = "Utilisation : Bois
                  Temps de séchage : 9min
                  Entretien: Ne laissez pas cette colle geler
                  Remarque: Taches";
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Lecteur NFC LG";
                  $p->description = "Lecteur NFC réf LG 12HGV0987NQSJH intégrable sur un système embarqué";
                  $p->picture = NULL;
                  $p->remainingQuantity = 1;
                  $p->minQuantity = 1;
                  $p->quantityUnit = "unité";
                  $p->price = 10;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Porte clé Fablab UTC";
                  $p->description = "Goodies";
                  $p->picture = NULL;
                  $p->remainingQuantity = 0;
                  $p->minQuantity = 4;
                  $p->quantityUnit = "unité";
                  $p->price = 2;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Carte mère Arduino EX455";
                  $p->description = "Carte mère Arduino de taile 2x5cm, water-proof";
                  $p->picture = NULL;
                  $p->remainingQuantity = 4;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "unité";
                  $p->price = 15.99;
                  $p->brand = "Arduino";
                  $p->supplier = "Farnell";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Colle àbois TITEBOND III";
                  $p->description = "La Titebond est une colle à bois qui reste souple lorsqu'elle est sèche, de ce fait, lors d'une utilisation intensive, elle ne se fissurera pas comme les colles plus rigides (époxy). Il s'agit d'une colle à base d'eau, facile et plus sûr à utiliser que les colles de type époxy.";
                  $p->picture = NULL;
                  $p->remainingQuantity = 3;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "Bidon";
                  $p->price = 18;
                  $p->brand = "TITEBOND";
                  $p->supplier = "Roarockit";
                  $p->supplierLink = "www.roarocki.fr";
                  $p->documentation = "www.roarocki.fr/titebond";
                  $p->dataSheet = "Utilisation : Bois
                  Temps de séchage : 9min
                  Entretien: Ne laissez pas cette colle geler
                  Remarque: Taches";
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Lecteur NFC LG";
                  $p->description = "Lecteur NFC réf LG 12HGV0987NQSJH intégrable sur un système embarqué";
                  $p->picture = NULL;
                  $p->remainingQuantity = 1;
                  $p->minQuantity = 1;
                  $p->quantityUnit = "unité";
                  $p->price = 10;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Porte clé Fablab UTC";
                  $p->description = "Goodies";
                  $p->picture = NULL;
                  $p->remainingQuantity = 0;
                  $p->minQuantity = 4;
                  $p->quantityUnit = "unité";
                  $p->price = 2;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Carte mère Arduino EX455";
                  $p->description = "Carte mère Arduino de taile 2x5cm, water-proof";
                  $p->picture = NULL;
                  $p->remainingQuantity = 4;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "unité";
                  $p->price = 15.99;
                  $p->brand = "Arduino";
                  $p->supplier = "Farnell";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Colle àbois TITEBOND III";
                  $p->description = "La Titebond est une colle à bois qui reste souple lorsqu'elle est sèche, de ce fait, lors d'une utilisation intensive, elle ne se fissurera pas comme les colles plus rigides (époxy). Il s'agit d'une colle à base d'eau, facile et plus sûr à utiliser que les colles de type époxy.";
                  $p->picture = NULL;
                  $p->remainingQuantity = 3;
                  $p->minQuantity = 2;
                  $p->quantityUnit = "Bidon";
                  $p->price = 18;
                  $p->brand = "TITEBOND";
                  $p->supplier = "Roarockit";
                  $p->supplierLink = "www.roarocki.fr";
                  $p->documentation = "www.roarocki.fr/titebond";
                  $p->dataSheet = "Utilisation : Bois
                  Temps de séchage : 9min
                  Entretien: Ne laissez pas cette colle geler
                  Remarque: Taches";
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Lecteur NFC LG";
                  $p->description = "Lecteur NFC réf LG 12HGV0987NQSJH intégrable sur un système embarqué";
                  $p->picture = NULL;
                  $p->remainingQuantity = 1;
                  $p->minQuantity = 1;
                  $p->quantityUnit = "unité";
                  $p->price = 10;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();

                  $p = new Product();
                  $p->name = "Porte clé Fablab UTC";
                  $p->description = "Goodies";
                  $p->picture = NULL;
                  $p->remainingQuantity = 0;
                  $p->minQuantity = 4;
                  $p->quantityUnit = "unité";
                  $p->price = 2;
                  $p->brand = "Arduino";
                  $p->supplier = "Arduino";
                  $p->supplierLink = NULL;
                  $p->documentation = NULL;
                  $p->dataSheet = NULL;
                  $p->categorie_id = 8;
                  $p->room_id = 1;
                  $p->wardrobe_id = 1;
                  $p->save();
            // }

            
    }
}
