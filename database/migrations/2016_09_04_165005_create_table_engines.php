<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableEngines extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //create Engines table
        Schema::create('Engines', function($table){

          //Général
          $table->increments('id');
          $table->string('name');
          $table->text('description')->nullable()->default(NULL);
          $table->string('picture')->nullable()->default(NULL);
          $table->integer('room_id')->unsigned()->nullable();
          $table->foreign('room_id')->references('id')->on('Rooms')->onDelete('set null');
          $table->string('status')->nullable();

          //Documentation
          $table->string('documentation')->nullable();
          $table->text('dataSheet')->nullable();

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
        //delete Engines table
        Schema::drop('Engines');

    }
}
