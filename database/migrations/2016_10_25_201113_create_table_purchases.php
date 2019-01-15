<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePurchases extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // La facture
        Schema::create('Purchases', function($table) {
          $table->increments('id');
          $table->string('login')->nullable();
          $table->string('association')->nullable();
          $table->timestamp('externalPaid')->nullable();
          
          $table->integer('address_id')->unsigned()->nullable(true);
          $table->foreign('address_id')->references('id')->on('Addresses')->onDelete('set null');

          $table->integer('entity_id')->unsigned()->nullable(true);
          $table->foreign('entity_id')->references('id')->on('Entity')->onDelete('set null');

          $table->timestamps();
        });

        // Un élément de la facture
        Schema::create('PurchasedElements', function($table) {
          $table->integer('id');
          $table->integer('version');
          $table->date('deadline')->nullable();
          $table->string('login_edit')->nullable();
          $table->integer('purchasable_id')->unsigned();                // clé primaire du type correspondant
          $table->string('purchasable_type');                           // Type (Product, Service)
          $table->float('purchasedQuantity', 8, 3);                     // Quantité commandée du Product/Service
          $table->float('suggestedPrice', 8, 2)->nullable();                        // Prix suggeré par le script de prix
          $table->float('finalPrice', 8, 2)->nullable();                            // Prix final
          $table->text('args')->nullable(true);
          $table->integer('status');
          $table->text('comment'); 
          $table->integer('purchase_id')->unsigned();                   // facture mère
          $table->foreign('purchase_id')->references('id')->on('Purchases')->onDelete('cascade');     
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
        Schema::drop('Purchases');
        Schema::drop('PurchasedElements');
    }
}
