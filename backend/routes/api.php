<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Toutes ces routes sont automatiquement préfixées par /api

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    // throttle:5,1 = 5 tentatives par minute, contre les essais de mots de passe
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Ces routes exigent un jeton valide
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});