<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEnginePartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('engine_parts', function (Blueprint $table) {

            //Général
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable()->default(NULL);
            $table->integer('engine_id')->unsigned()->nullable();
            $table->foreign('engine_id')->references('id')->on('Engines')->onDelete('set null');
            $table->integer('time_to_maintenance');
            $table->integer('next_maintenance')->nullable()->default(NULL);
            $table->boolean('need_maintenance')->default(false);

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
        Schema::dropIfExists('engine_parts');
    }
}
