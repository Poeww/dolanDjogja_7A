<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_trip', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('paket_id');

            $table->date('tanggal_berangkat');
            $table->date('tanggal_pulang');
            $table->integer('kuota_tersedia')->default(0);
            $table->decimal('harga_per_orang', 12, 2);

            $table->timestamps();

            $table->foreign('paket_id')->references('id')->on('paket_wisata')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_trip');
    }
};