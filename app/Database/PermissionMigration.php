<?php
/**
 * Created by PhpStorm.
 * User: corentinhembise
 * Date: 04/12/2017
 * Time: 16:07
 */

namespace App\Database;


use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

abstract class PermissionMigration extends Migration
{
    protected abstract function permissions();

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        foreach ($this->permissions() as $slug => $description) {
            DB::table('permissions')->insert([
                'slug' => $slug,
                'description' => $description,
                'created_at' => new \DateTime(),
                'updated_at' => new \DateTime(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('permissions')->whereIn('slug',  array_keys($this->permissions()))->delete();
    }
}