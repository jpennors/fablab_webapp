<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateTableEntity extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("Entity", function(Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string("asso_number")->nullable();
            $table->string("siren")->nullable();
            $table->string("invoice_address");
            $table->string("mail")->nullable();
            $table->string("site")->nullable();
            $table->string("abreviation");
            $table->string("phone")->nullable();
            $table->text("legals");
            $table->boolean("default")->default(false);
            $table->date("updated_at");
            $table->date("created_at");

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
        Schema::drop("Entity");
    }
}
