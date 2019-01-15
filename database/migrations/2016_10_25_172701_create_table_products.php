<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProducts extends Migration
{
    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        Schema::create('Products', function($table) {

            //Général
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('picture')->nullable();

            //Vente du produit
            $table->float('price', 8, 2)->nullable(false)->default(0);

            //Quantités
            $table->string('quantityUnit')->nullable();
            $table->float('remainingQuantity', 8, 3)->nullable(false);
            $table->float('minQuantity', 8, 3)->nullable(true);

            //Fournisseur & Marque
            $table->string('brand')->nullable();
            $table->string('supplier')->nullable();
            $table->string('supplierLink')->nullable();

            //Documentation
            $table->string('documentation')->nullable();
            $table->text('dataSheet')->nullable();

            //Catégorie WeezeEvent
            $table->integer('categorie_id')->unsigned()->nullable()->default(NULL);
            $table->foreign('categorie_id')->references('id')->on('categories')->onDelete('set null');

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
        Schema::drop('Products');
    }
}
