<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    // is_certified est absent : seul un administrateur peut certifier une agence
    protected $fillable = [
        'name',
        'rccm',
        'phone',
        'email',
        'city',
        'address',
        'logo_path',
    ];

    protected function casts(): array
    {
        return [
            'is_certified' => 'boolean',
        ];
    }

    // Les membres de l'agence (agents et administrateur)
    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }
}