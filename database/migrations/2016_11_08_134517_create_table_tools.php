<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTools extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
      //create Tools table
      Schema::create('Tools', function($table){
        $table->increments('id');
        $table->string('type');

        //Infos Tools
        $table->string('name');
        $table->string('description')->nullable()->default(NULL);
        $table->string('picture')->nullable()->default(NULL);
        $table->integer('wardrobe_id')->unsigned()->nullable()->default(NULL);
        $table->foreign('wardrobe_id')->references('id')->on('Wardrobes')->onDelete('set null');
        $table->integer('room_id')->unsigned()->nullable();
        $table->foreign('room_id')->references('id')->on('Rooms')->onDelete('set null');
        $table->string('supplier')->nullable();

        //Quantité
        $table->string('quantityUnit');
        $table->integer('remainingQuantity');
        $table->integer('minQuantity');

        //Infos Chemicals
        $table->string('toxicity')->nullable()->default(NULL);
        $table->date('expiryDate')->nullable()->default(NULL);
        $table->date('dateOfPurchase')->nullable()->default(NULL);

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
      //delete Tools table
      Schema::drop('Tools');
  }
}
