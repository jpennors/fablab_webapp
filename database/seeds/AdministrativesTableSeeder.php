<?php

use Illuminate\Database\Seeder;
use App\Administrative;

class AdministrativesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $a = new Administrative(['key' => 'website', 'desc' => 'Site web', 'value' => 'http://assos.utc.fr/fablab']);
      $a->save();

      $a = new Administrative(['key' => 'email', 'desc' => 'Email', 'value' => 'fablab@assos.utc.fr']);
      $a->save();

      $a = new Administrative(['key' => 'invoice_address', 'desc' => 'Adresse facture', 'value' => "MDE - UTC \nRue Roger Couttolenc\n60200 Compiègne"]);
      $a->save();

      $a = new Administrative(['key' => 'asso_number', 'desc' => 'Numéro d\'asso', 'value' => 'W603003228']);
      $a->save();

      $a = new Administrative(['key' => 'siren', 'desc' => 'Numéro de Siren', 'value' => '814 497 210']);
      $a->save();
    }
}
