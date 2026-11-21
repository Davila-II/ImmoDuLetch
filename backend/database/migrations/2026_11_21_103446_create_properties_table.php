<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30)->unique(); // ex. CMR-9428

            // Qui possède et gère le bien
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('agency_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('category_id')->constrained();

            // sale (vente) ou rent (location)
            $table->string('transaction_type', 10)->default('sale');
            // draft, pending, published, suspended, expired, rejected
            $table->string('status', 20)->default('draft');
            $table->unsignedTinyInteger('draft_step')->default(1); // étape du formulaire (1 à 4)

            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price')->nullable(); // en FCFA, sans décimales

            // Localisation
            $table->string('city', 100)->nullable();
            $table->string('neighborhood', 100)->nullable();
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Caractéristiques
            $table->unsignedInteger('built_area')->nullable(); // surface bâtie en m²
            $table->unsignedInteger('land_area')->nullable();  // superficie du terrain en m²
            $table->unsignedTinyInteger('rooms')->nullable();
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();

            // title_available, document_unverified, document_verified, to_verify
            $table->string('land_status', 30)->nullable();
            $table->string('land_title_number', 50)->nullable();

            // Mise en avant
            $table->boolean('is_exclusive')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('virtual_tour_url')->nullable();

            // Statistiques et modération
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('contacts_count')->default(0);
            $table->text('rejection_reason')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Index pour accélérer la recherche
            $table->index(['status', 'transaction_type', 'city']);
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};