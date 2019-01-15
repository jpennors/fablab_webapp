<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('Users', function($table) {

        $table->increments('id');
        $table->enum('type', ['user', 'member'])->default('user');

        // Informations de base des utilisateurs
        $table->string('firstName');
        $table->string('lastName');
        $table->string('email');
        $table->string('login')->unique();
        $table->enum('status', ['étudiant', 'professeur', 'personnel', 'autre'])->default('autre');
        $table->boolean('terms')->default(false);

        // Informations sur les membres
        $table->boolean('active')->nullable();  // à NULL si non membre
        $table->boolean('admin')->nullable();   // à NULL si non membre


        $table->integer('role_id')->unsigned();
        $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');

        $table->integer('entity_id')->unsigned()->nullable(true);
        $table->foreign('entity_id')->references('id')->on('Entity')->onDelete('set null');

        // Dans le cas d'une suppression softDelete
        $table->softDeletes();

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('Users');
    }
}
