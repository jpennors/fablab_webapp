<?php

use Illuminate\Database\Seeder;
use App\ServiceScript;
use App\Service;
use App\Engine;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // if (env('APP_ENV') != 'production') {

            $s = new Service();
            $s->name = "Découpe laser FT567";
            $s->description = "Découpe laser FT567, rapide, destiné à tous";
            $s->script()->associate(ServiceScript::findOrFail(2));
            $s->engine()->associate(Engine::findOrFail(2));
            $s->type = "cutting";
            $s->save();

            $s = new Service();
            $s->name = "Impression 3D XFERT";
            $s->description = "Impression 3D avec la machine XFERT, précision accrue, à réserver aux impressions sérieuses";
            $s->script()->associate(ServiceScript::findOrFail(1));
            $s->engine()->associate(Engine::findOrFail(1));
            $s->type = "printing";
            $s->save();
        // }
    }
}
