<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSemesterToPurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Purchases', function (Blueprint $table) {
            $table->integer('semester_id')->unsigned()->nullable(true);
            $table->foreign('semester_id')->references('id')->on('semesters');
            $table->index('semester_id');
        });

        Schema::table('PurchasedElements', function (Blueprint $table) {
            $table->integer('semester_id')->unsigned()->nullable(true);
            $table->foreign('semester_id')->references('id')->on('semesters');
            $table->index('semester_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
