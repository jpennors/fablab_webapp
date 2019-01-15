<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableLogs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('Logs', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('user_id')->unsigned();
        $table->string('token');
        $table->string('CAS');
        $table->boolean('disabled')->default(false);
        $table->string('payutc_sessionid')->nullable(true);
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('Users')->onDelete('cascade');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('Logs');
    }
}
