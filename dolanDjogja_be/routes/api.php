<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaketWisataController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\JadwalTripController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;

use App\Http\Controllers\ChartController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Paket Wisata (read-only)
Route::get('/paket-wisata',        [PaketWisataController::class, 'index']);
Route::get('/paket-wisata/{id}',   [PaketWisataController::class, 'show']);

// Destinasi (read-only)
Route::get('/destinasi',           [DestinasiController::class, 'index']);
Route::get('/destinasi/{id}',      [DestinasiController::class, 'show']);

// Jadwal Trip (read-only)
Route::get('/jadwal-trip',         [JadwalTripController::class, 'index']);
Route::get('/jadwal-trip/{id}',    [JadwalTripController::class, 'show']);


/*
|--------------------------------------------------------------------------
| CHART ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/chart/bookings-monthly',   [ChartController::class, 'bookingMonthly']);
Route::get('/chart/revenue-monthly',    [ChartController::class, 'revenueMonthly']);
Route::get('/chart/paket-popular',      [ChartController::class, 'paketPopular']);
Route::get('/chart/destinasi-popular',  [ChartController::class, 'destinasiPopular']);
Route::get('/chart/kuota-trip',         [ChartController::class, 'kuotaTrip']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);


    /*
    |--------------------------------------------------------------------------
    | CUSTOMER ROUTES
    |--------------------------------------------------------------------------
    */

    Route::post('/bookings', [BookingController::class, 'store']);

    Route::get('/my-bookings', function (Request $request) {
        return $request->user()->bookings()->with('jadwalTrip.paket')->get();
    });

    Route::get('/bookings/{id}', [BookingController::class, 'show']);


    Route::post('/payments', [PaymentController::class, 'store']);


    /*
    |--------------------------------------------------------------------------
    | ADMIN ROUTES
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {

        // CRUD User
        Route::get('/users',        [UserController::class, 'index']);
        Route::get('/users/{id}',   [UserController::class, 'show']);
        Route::post('/users',       [UserController::class, 'store']);
        Route::put('/users/{id}',   [UserController::class, 'update']);
        Route::delete('/users/{id}',[UserController::class, 'destroy']);

        // CRUD Paket Wisata
        Route::post('/paket-wisata',        [PaketWisataController::class, 'store']);
        Route::put('/paket-wisata/{id}',    [PaketWisataController::class, 'update']);
        Route::delete('/paket-wisata/{id}', [PaketWisataController::class, 'destroy']);

        // CRUD Destinasi
        Route::post('/destinasi',        [DestinasiController::class, 'store']);
        Route::put('/destinasi/{id}',    [DestinasiController::class, 'update']);
        Route::delete('/destinasi/{id}', [DestinasiController::class, 'destroy']);

        // CRUD Jadwal Trip
        Route::post('/jadwal-trip',        [JadwalTripController::class, 'store']);
        Route::put('/jadwal-trip/{id}',    [JadwalTripController::class, 'update']);
        Route::delete('/jadwal-trip/{id}', [JadwalTripController::class, 'destroy']);

        // Booking (admin)
        Route::get('/bookings',          [BookingController::class, 'index']);
        Route::put('/bookings/{id}',     [BookingController::class, 'update']);
        Route::delete('/bookings/{id}',  [BookingController::class, 'destroy']);

        // Payments (admin verify)
        Route::get('/payments',          [PaymentController::class, 'index']);
        Route::get('/payments/{id}',     [PaymentController::class, 'show']);
        Route::put('/payments/{id}',     [PaymentController::class, 'update']);
        Route::delete('/payments/{id}',  [PaymentController::class, 'destroy']);
    });
});