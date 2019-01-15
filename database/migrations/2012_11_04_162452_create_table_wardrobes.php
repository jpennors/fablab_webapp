<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableWardrobes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //create Wardrobes table
        Schema::create('Wardrobes', function($table){
          $table->increments('id');
          $table->string('name');
          $table->integer('room_id')->unsigned()->nullable();
          $table->foreign('room_id')->references('id')->on('Rooms')->onDelete('set null');
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
        //delete Wardrobes table
        Schema::drop('Wardrobes');
    }
}
