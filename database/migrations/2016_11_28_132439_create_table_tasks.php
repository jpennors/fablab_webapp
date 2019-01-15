<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTasks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      //create Tasks table
      Schema::create('Tasks', function($table){
        $table->increments('id');
        $table->string('name');
        $table->string('description')->nullable()->default(NULL);
        $table->integer('author_id')->unsigned();
        $table->dateTime('deadline_date')->nullable()->default(NULL);
        $table->integer('percents_realized')->nullable()->default(0);
        $table->timestamps();

        $table->foreign('author_id')->references('id')->on('Users');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      //delete Tasks table
      Schema::drop('Tasks');
    }
}
