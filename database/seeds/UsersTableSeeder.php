<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Member;
use App\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = array(
          [
              'type' => 'member',
              'firstName' => 'Josselin',
              'lastName' => 'Pennors',
              'email' => 'josselin.pennors@etu.utc.fr',
              'login' => 'jpennors',
              'status' => 'étudiant',
              'terms' => false,
              'active' => true,
              'admin' => true,
              'role_id' => 1,
          ],
          [
              'type' => 'member',
              'firstName' => 'Nicolas',
              'lastName' => 'Piton',
              'email' => 'nicolas.piton@utc.fr',
              'login' => 'pitonnic',
              'status' => 'étudiant',
              'terms' => false,
              'active' => true,
              'admin' => true,
              'role_id' => 1,
          ],
          [
              'type' => 'member',
              'firstName' => 'Ayman',
              'lastName' => 'Lamdasni',
              'email' => 'ayman.lamdasni@etu.utc.fr',
              'login' => 'alamdasn',
              'status' => 'étudiant',
              'terms' => false,
              'active' => true,
              'admin' => true,
              'role_id' => 1,
          ],
                    [
              'type' => 'member',
              'firstName' => 'Loic',
              'lastName' => 'Yvinec',
              'email' => 'loic.yvinec@etu.utc.fr',
              'login' => 'yvineclo',
              'status' => 'étudiant',
              'terms' => false,
              'active' => true,
              'admin' => true,
              'role_id' => 1,
          ],

        );

        $u = new Member($users[0]);
        //$u->role()->associate(Role::where('name', '=', 'Super admin')->firstOrFail());
        $u->save();

        $u = new Member($users[1]);
        //$u->role()->associate(Role::where('name', '=', 'Super admin')->firstOrFail());
        $u->save();

        $u = new Member($users[2]);
        //$u->role()->associate(Role::where('name', '=', 'Super admin')->firstOrFail());
        $u->save();

        $u = new Member($users[3]);
        //$u->role()->associate(Role::where('name', '=', 'Super admin')->firstOrFail());
        $u->save();

    }
}
