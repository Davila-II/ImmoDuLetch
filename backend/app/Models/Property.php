<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use SoftDeletes; // un bien supprimé reste en base (colonne deleted_at)

    // Valeurs autorisées, réutilisées plus tard pour valider les formulaires
    public const TRANSACTION_TYPES = ['sale', 'rent'];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING = 'pending';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_SUSPENDED = 'suspended';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_PENDING,
        self::STATUS_PUBLISHED,
        self::STATUS_SUSPENDED,
        self::STATUS_EXPIRED,
        self::STATUS_REJECTED,
    ];

    public const LAND_STATUSES = [
        'title_available',     // titre foncier déclaré disponible
        'document_unverified', // document fourni mais non vérifié
        'document_verified',   // document vérifié par un professionnel
        'to_verify',           // situation foncière à vérifier
    ];

    // Champs que le propriétaire peut remplir depuis le formulaire.
    // Absents volontairement : user_id, agency_id, agent_id, status, is_exclusive,
    // is_featured, compteurs, motif de rejet, dates de publication.
    // Ils sont attribués par le code, pas par la requête.
    protected $fillable = [
        'category_id',
        'transaction_type',
        'draft_step',
        'title',
        'description',
        'price',
        'city',
        'neighborhood',
        'address',
        'latitude',
        'longitude',
        'built_area',
        'land_area',
        'rooms',
        'bedrooms',
        'bathrooms',
        'year_built',
        'land_status',
        'land_title_number',
        'virtual_tour_url',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'is_exclusive' => 'boolean',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    // Génère automatiquement la référence (ex. CMR-482913) à la création du bien
    protected static function booted(): void
    {
        static::creating(function (Property $property) {
            if (empty($property->reference)) {
                $property->reference = static::generateReference();
            }
        });
    }

    public static function generateReference(): string
    {
        do {
            $reference = 'CMR-' . random_int(100000, 999999);
        } while (static::withTrashed()->where('reference', $reference)->exists());

        return $reference;
    }

    // Prix au m² : calculé à la volée à partir de la surface bâtie (sinon du terrain)
    protected function pricePerSqm(): Attribute
    {
        return Attribute::get(function () {
            $area = $this->built_area ?: $this->land_area;

            return ($this->price && $area) ? (int) round($this->price / $area) : null;
        });
    }

    // Filtre réutilisable : Property::published()->get()
    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    // Le propriétaire (celui qui a déposé l'annonce)
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    // L'agent chargé du bien (dans une agence)
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('position');
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    // Les utilisateurs qui ont mis ce bien en favori
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}