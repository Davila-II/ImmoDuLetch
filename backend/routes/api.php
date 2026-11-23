<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\MyPropertyController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use Illuminate\Support\Facades\Route;

// Toutes ces routes sont automatiquement préfixées par /api

// --- Authentification ---
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// --- Catalogue (public) ---
Route::get('categories', [CatalogController::class, 'categories']);
Route::get('amenities', [CatalogController::class, 'amenities']);

// --- Biens publiés (public) ---
// {property:reference} : on cherche le bien par sa référence (CMR-123456) et non par son id
Route::get('properties', [PropertyController::class, 'index']);
Route::get('properties/{property:reference}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('properties/{property:reference}/similar', [PropertyController::class, 'similar']);

// --- Espace connecté : mes annonces ---
Route::middleware('auth:sanctum')->prefix('my')->name('my.')->group(function () {
    Route::get('properties', [MyPropertyController::class, 'index'])->name('properties.index');
    Route::post('properties', [MyPropertyController::class, 'store'])->name('properties.store');
    Route::get('properties/{property:reference}', [MyPropertyController::class, 'show'])->name('properties.show');
    Route::match(['put', 'patch'], 'properties/{property:reference}', [MyPropertyController::class, 'update'])->name('properties.update');
    Route::delete('properties/{property:reference}', [MyPropertyController::class, 'destroy'])->name('properties.destroy');
    Route::post('properties/{property:reference}/submit', [MyPropertyController::class, 'submit'])->name('properties.submit');

    // Photos d'un bien
    // scopeBindings() : Laravel vérifie que l'{image} appartient bien à ce bien
    Route::post('properties/{property:reference}/images', [PropertyImageController::class, 'store'])->name('properties.images.store');
    Route::put('properties/{property:reference}/images/order', [PropertyImageController::class, 'reorder'])->name('properties.images.reorder');
    Route::patch('properties/{property:reference}/images/{image}', [PropertyImageController::class, 'update'])->name('properties.images.update')->scopeBindings();
    Route::delete('properties/{property:reference}/images/{image}', [PropertyImageController::class, 'destroy'])->name('properties.images.destroy')->scopeBindings();
});