<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            // Peut être vide : un visiteur non connecté peut aussi contacter
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name');
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('message')->nullable();

            // contact, visit, whatsapp, call
            $table->string('type', 20)->default('contact');
            $table->timestamp('visit_at')->nullable(); // date de visite souhaitée
            // new, read, handled
            $table->string('status', 20)->default('new');

            $table->timestamps();

            $table->index(['property_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};