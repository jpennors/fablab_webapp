<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMaintenancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->increments('id');
            $table->string('description')->nullable()->default(NULL);
            $table->integer('author_id')->unsigned();
            $table->integer('engine_part_id')->unsigned();
            $table->dateTime('deadline_date')->nullable()->default(NULL);
            $table->integer('percents_realized')->nullable()->default(0);
            $table->timestamps();

            $table->foreign('author_id')->references('id')->on('Users');
            $table->foreign('engine_part_id')->references('id')->on('engine_parts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('maintenances');
    }
}
