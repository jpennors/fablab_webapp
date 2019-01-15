<?php

use Illuminate\Database\Seeder;
use App\ServiceScript;

class ServiceScriptsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // if (env('APP_ENV') != 'production') {

            $s = new ServiceScript();
            $s->name = "Calcul imprimante 3D XFERT";
            $s->description = "Prend en compte la précision voulue p, le temps estimé t";
            $s->script = "(function (args) { var p = args['p']; var t = args['t']; return p+t; })";
            $s->args = "[{\"name\" : \"p\", \"desc\" : \"Précision\", \"type\" : \"float\", \"permission\" : true}, {\"name\" : \"t\", \"desc\" : \"Temps estimé\", \"type\" : \"string\", \"permission\" : false}]";
            $s->save();

            $s = new ServiceScript();
            $s->name = "Calcul découpe laser FT567";
            $s->description = "Prend en compte le temps estimé t";
            $s->script = "(function (args) { var t = args['t']; return t*89.108786; })";
            $s->args = "[{\"name\" : \"t\", \"desc\" : \"Temps estimé\", \"type\" : \"string\", \"permission\" : false}]";
            $s->save();
    
        // }

    }
}
