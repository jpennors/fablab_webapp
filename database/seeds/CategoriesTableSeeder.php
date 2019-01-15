<?php

use Illuminate\Database\Seeder;
use App\Categorie;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $c = new Categorie();
      $c->name = "Electronique";
      $c->save();

      $c = new Categorie();
      $c->name = "Formation";
      $c->save();

      $c = new Categorie();
      $c->name = "Imprimante 3D";
      $c->save();

      $c = new Categorie();
      $c->name = "Payement Team Skate";
      $c->save();

      $c = new Categorie();
      $c->name = "Autre";
      $c->save();

      $c = new Categorie();
      $c->name = "Stickers";
      $c->save();

      $c = new Categorie();
      $c->name = "Sebastien-webapp";
      $c->save();

      $c = new Categorie();
      $c->name = "hjgiygu";
      $c->save();
    }
}
