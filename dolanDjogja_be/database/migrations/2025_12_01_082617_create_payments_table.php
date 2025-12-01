<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('booking_id');

            $table->decimal('jumlah_bayar', 12, 2);
            $table->string('bukti_pembayaran')->nullable();
            $table->enum('status_verifikasi', ['pending', 'verified', 'rejected'])
                  ->default('pending');

            $table->timestamps();

            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};