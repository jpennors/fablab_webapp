<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTransactions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('Transactions', function($table){
        $table->increments('id');
        $table->string('name');
        $table->float('amount', 8, 2);
        $table->timestamp('canceled')->nullable();
        $table->integer('purchase_id')->unsigned()->nullable();
        $table->integer('payutc_id')->unsigned()->nullable(true);
        $table->string('session_id');
        $table->boolean('paid');
        $table->timestamps();

        $table->foreign('purchase_id')->references('id')->on('Purchases')->onDelete('set null');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('Transactions');
    }
}
