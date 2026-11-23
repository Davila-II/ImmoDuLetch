<?php

use App\Http\Controllers\Api\Admin\AgencyController;
use App\Http\Controllers\Api\Admin\PropertyModerationController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\MyPropertyController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use App\Http\Middleware\EnsureUserIsAdmin;
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

// Demande de contact ou de visite : ouverte aux visiteurs non connectés.
// throttle:10,1 = 10 envois par minute et par adresse IP, contre le spam
Route::post('properties/{property:reference}/inquiries', [InquiryController::class, 'store'])
    ->middleware('throttle:10,1');

// --- Favoris (jeton requis) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::put('properties/{property:reference}/favorite', [FavoriteController::class, 'store']);
    Route::delete('properties/{property:reference}/favorite', [FavoriteController::class, 'destroy']);
});

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

    // Demandes reçues sur mes biens
    Route::get('inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
    Route::patch('inquiries/{inquiry}', [InquiryController::class, 'update'])->name('inquiries.update');
});

// --- Administration (jeton requis ET compte administrateur) ---
Route::middleware(['auth:sanctum', EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('stats', StatsController::class)->name('stats');

    // Modération des annonces
    Route::get('properties', [PropertyModerationController::class, 'index'])->name('properties.index');
    Route::get('properties/{property:reference}', [PropertyModerationController::class, 'show'])->name('properties.show');
    Route::post('properties/{property:reference}/approve', [PropertyModerationController::class, 'approve'])->name('properties.approve');
    Route::post('properties/{property:reference}/reject', [PropertyModerationController::class, 'reject'])->name('properties.reject');
    Route::post('properties/{property:reference}/suspend', [PropertyModerationController::class, 'suspend'])->name('properties.suspend');
    Route::post('properties/{property:reference}/reinstate', [PropertyModerationController::class, 'reinstate'])->name('properties.reinstate');
    Route::patch('properties/{property:reference}/flags', [PropertyModerationController::class, 'flags'])->name('properties.flags');

    // Utilisateurs (lecture seule)
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');

    // Agences
    Route::get('agencies', [AgencyController::class, 'index'])->name('agencies.index');
    Route::post('agencies', [AgencyController::class, 'store'])->name('agencies.store');
    Route::get('agencies/{agency}', [AgencyController::class, 'show'])->name('agencies.show');
    Route::patch('agencies/{agency}', [AgencyController::class, 'update'])->name('agencies.update');
    Route::post('agencies/{agency}/members', [AgencyController::class, 'addMember'])->name('agencies.members.add');
    Route::delete('agencies/{agency}/members/{user}', [AgencyController::class, 'removeMember'])->name('agencies.members.remove');
});