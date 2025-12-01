<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaketWisataController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\JadwalTripController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Tidak perlu login)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/paket-wisata', [PaketWisataController::class, 'index']);
Route::get('/paket-wisata/{id}', [PaketWisataController::class, 'show']);

Route::get('/destinasi', [DestinasiController::class, 'index']);
Route::get('/destinasi/{id}', [DestinasiController::class, 'show']);

Route::get('/jadwal-trip', [JadwalTripController::class, 'index']);
Route::get('/jadwal-trip/{id}', [JadwalTripController::class, 'show']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // ============================
    // CUSTOMER ROUTES
    // ============================

    // Booking Trip
    Route::post('/bookings', [BookingController::class, 'store']);

    Route::get('/my-bookings', function (Request $request) {
        return $request->user()->bookings()
               ->with('jadwalTrip.paket')
               ->get();
    });

    Route::get('/bookings/{id}', [BookingController::class, 'show']);

    Route::post('/payments', [PaymentController::class, 'store']);


    // ============================
    // ADMIN ONLY ROUTES
    // ============================
    Route::middleware('admin')->group(function () {

        // Paket Wisata CRUD
        Route::post('/paket-wisata', [PaketWisataController::class, 'store']);
        Route::put('/paket-wisata/{id}', [PaketWisataController::class, 'update']);
        Route::delete('/paket-wisata/{id}', [PaketWisataController::class, 'destroy']);

        // Destinasi CRUD
        Route::post('/destinasi', [DestinasiController::class, 'store']);
        Route::put('/destinasi/{id}', [DestinasiController::class, 'update']);
        Route::delete('/destinasi/{id}', [DestinasiController::class, 'destroy']);

        // Jadwal Trip CRUD
        Route::post('/jadwal-trip', [JadwalTripController::class, 'store']);
        Route::put('/jadwal-trip/{id}', [JadwalTripController::class, 'update']);
        Route::delete('/jadwal-trip/{id}', [JadwalTripController::class, 'destroy']);

        // Admin Manage Bookings
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::put('/bookings/{id}', [BookingController::class, 'update']);
        Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

        // Admin Payment Verification
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::put('/payments/{id}', [PaymentController::class, 'update']);
        Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    });

});