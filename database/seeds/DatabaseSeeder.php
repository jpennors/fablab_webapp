<?php

use Illuminate\Database\Seeder;
use App\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      $this->call(PermissionsSeeder::class);
      $this->call(RolesSeeder::class);
      $this->call(RoomsTableSeeder::class);
      $this->call(WardrobesTableSeeder::class);
      $this->call(EnginesTableSeeder::class);
      $this->call(CategoriesTableSeeder::class);


      $this->call(AdministrativesTableSeeder::class);
      $this->call(UsersTableSeeder::class);
      $this->call(AddressesTableSeeder::class);
      $this->call(ExpendablesTableSeeder::class);
      $this->call(EntitiesTableSeeder::class);

      $this->call(ServiceScriptsTableSeeder::class);

      $this->call(TasksTableSeeder::class);

      $this->call(ProductsTableSeeder::class);
      $this->call(ToolsTableSeeder::class);
      $this->call(ServicesTableSeeder::class);

    }
}
