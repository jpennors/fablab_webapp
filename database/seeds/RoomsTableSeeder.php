<?php

use Illuminate\Database\Seeder;
use App\Room;

class RoomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $r = new Room();
      $r->name = "E";
      $r->description = "Atelier Eléctronique";
      $r->picture = NULL;
      $r->save();

      $r = new Room();
      $r->name = "M";
      $r->description = "Atelier Mécanique";
      $r->picture = NULL;
      $r->save();

      $r = new Room();
      $r->name = "R";
      $r->description = "Réserve";
      $r->picture = NULL;
      $r->save();

      $r = new Room();
      $r->name = "P";
      $r->description = "Atelier Projet";
      $r->picture = NULL;
      $r->save();

    }
}
