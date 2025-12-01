<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paket_destinasi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('paket_id');
            $table->unsignedBigInteger('destinasi_id');

            $table->foreign('paket_id')->references('id')->on('paket_wisata')->onDelete('cascade');
            $table->foreign('destinasi_id')->references('id')->on('destinasi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paket_destinasi');
    }
};