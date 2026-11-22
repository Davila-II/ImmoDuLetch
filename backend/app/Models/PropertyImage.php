<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{
    protected $fillable = [
        'path',
        'caption',
        'position',
        'is_primary',
    ];

    // Ajoute automatiquement le champ « url » quand l'image est convertie en JSON (API)
    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    // URL publique de la photo (nécessite php artisan storage:link)
    protected function url(): Attribute
    {
        return Attribute::get(fn () => Storage::url($this->path));
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}