<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Type de compte : particulier, independant ou agence
            $table->string('phone', 20)->nullable()->unique()->after('email');
            $table->string('account_type', 20)->default('particulier')->after('phone');
            // Rôle sur la plateforme : user ou admin
            $table->string('role', 20)->default('user')->after('account_type');
            // Agence de rattachement (pour les agents et l'administrateur d'agence)
            $table->foreignId('agency_id')->nullable()->after('role')
                ->constrained()->nullOnDelete();
            $table->boolean('is_agency_admin')->default(false)->after('agency_id');
            $table->string('avatar_path')->nullable()->after('is_agency_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agency_id');
            $table->dropUnique(['phone']);
            $table->dropColumn(['phone', 'account_type', 'role', 'is_agency_admin', 'avatar_path']);
        });
    }
};