<?php

use Illuminate\Database\Seeder;
use App\Task;

class TasksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // if (env('APP_ENV') != 'production') {

            $r = new Task();
            $r->name = "Une première tâche";
            $r->description = "Au travail !";
            $r->author_id = 1;
            $r->deadline_date = '2016-12-25 12:00:00';
            $r->percents_realized = 10;
            $r->save();

            $r = new Task();
            $r->name = "Une deuxième tâche";
            $r->description = "Vive le Pic.";
            $r->author_id = 2;
            $r->deadline_date = NULL;
            $r->percents_realized = 76;
            $r->save();

            $r = new Task();
            $r->name = "Commande de matériel";
            $r->description = "Urgent ! Passer la commande de matériel";
            $r->author_id = 2;
            $r->deadline_date = '2016-12-23 20:00:00';
            $r->percents_realized = NULL;
            $r->save();

        // }
    }
}
