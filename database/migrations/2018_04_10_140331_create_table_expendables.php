<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableExpendables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // create expendables table
        Schema::create('Expendables', function ($table) {
            $table->increments('id');
            $table->string('name');
            $table->string('brand')->nullable()->default(NULL);
            $table->string('supplier')->nullable()->default(NULL);
            $table->string('supplierLink')->nullable()->default(NULL);
            $table->string('quantityUnit')->nullable(false);
            $table->float('remainingQuantity', 8, 3)->nullable(false);
            $table->float('minQuantity', 8, 3)->nullable();
            $table->text('description')->nullable()->default(NULL);
            $table->string('picture')->nullable()->default(NULL);

            $table->foreign('wardrobe_id')->references('id')->on('Wardrobes')->onDelete('set null');
            $table->integer('wardrobe_id')->unsigned()->nullable()->default(NULL); 
            $table->integer('room_id')->unsigned()->nullable();
            $table->foreign('room_id')->references('id')->on('Rooms')->onDelete('set null');
            
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
        Schema::dropIfExists('Expendables');
    }
}
