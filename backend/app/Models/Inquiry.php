<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    public const TYPES = ['contact', 'visit', 'whatsapp', 'call'];
    public const STATUSES = ['new', 'read', 'handled'];

    // property_id et user_id sont attribués par le code, pas par la requête
    protected $fillable = [
        'name',
        'phone',
        'email',
        'message',
        'type',
        'visit_at',
    ];

    protected function casts(): array
    {
        return [
            'visit_at' => 'datetime',
        ];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}