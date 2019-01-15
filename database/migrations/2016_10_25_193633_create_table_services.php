<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableServices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('Services', function($table) {
        $table->increments('id');
        $table->string('name');
        $table->text('description');
        $table->string('type');
        $table->integer('script_id')->unsigned()->nullable();
        $table->foreign('script_id')->references('id')->on('ServiceScripts')->onDelete('set null');
        $table->integer('engine_id')->unsigned()->nullable();
        $table->foreign('engine_id')->references('id')->on('Engines')->onDelete('set null');
        $table->integer('payutc_id')->unsigned()->nullable(true);
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
        Schema::drop('Services');
    }
}
