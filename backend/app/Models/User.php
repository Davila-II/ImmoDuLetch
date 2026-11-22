<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // HasApiTokens : permet à Sanctum de créer des jetons de connexion pour l'API
    use HasApiTokens, HasFactory, Notifiable;

    public const ACCOUNT_TYPES = ['particulier', 'independant', 'agence'];
    public const ROLE_USER = 'user';
    public const ROLE_ADMIN = 'admin';

    // Seuls ces champs peuvent être remplis depuis une requête (inscription).
    // role, agency_id et is_agency_admin sont volontairement absents :
    // ils sont attribués par le code, jamais par l'utilisateur.
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'account_type',
        'avatar_path',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // le mot de passe est chiffré automatiquement
            'is_agency_admin' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    // Les biens publiés par cet utilisateur
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    // Les biens mis en favori (via la table favorites)
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'favorites')->withTimestamps();
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}