<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('jadwal_trip_id');

            $table->integer('jumlah_orang');
            $table->decimal('total_harga', 12, 2);

            $table->string('metode_pembayaran')->nullable();

            $table->enum('status_pembayaran', ['pending', 'paid', 'cancelled'])
                  ->default('pending');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('jadwal_trip_id')->references('id')->on('jadwal_trip')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};