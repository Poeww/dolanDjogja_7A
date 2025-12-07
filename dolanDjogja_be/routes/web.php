<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/destinasi/{filename}', function ($filename) {
    $path = public_path('destinasi/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});
