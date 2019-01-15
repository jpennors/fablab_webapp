<?php

use Illuminate\Database\Seeder;
use App\Address;

class AddressesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $a = new Address([
                          'name' => 'UTeam',
                          'address' => "Centre de Transfert\n66, avenue de Landshut CS10154",
                          'city' => 'Compiègne Cedex',
                          'cp' => '60201',
                          'country' => 'France'
                        ]);
      $a->save();
    }
}
