<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableRooms extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //create Rooms table
        Schema::create('Rooms', function($table){
          $table->increments('id');
          $table->string('name');
          $table->string('description')->nullable()->default(NULL);
          $table->string('picture')->nullable()->default(NULL);

          $table->timestamps();
          $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //delete Rooms table
        Schema::drop('Rooms');
    }
}
