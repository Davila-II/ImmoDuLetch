<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PropertyController extends Controller
{
    // Relations chargées d'avance (« eager loading ») pour éviter une requête par bien
    private const RELATIONS = [
        'category',
        'images',
        'amenities',
        'owner:id,name,phone',
        'agency:id,name,is_certified',
    ];

    // GET /api/properties : liste filtrée et paginée
    public function index(Request $request)
    {
        // On valide les paramètres de l'URL : une valeur invalide renvoie une erreur 422
        $filters = $request->validate([
            'transaction_type' => ['sometimes', Rule::in(Property::TRANSACTION_TYPES)],
            'category' => ['sometimes', 'string', 'exists:categories,slug'],
            'city' => ['sometimes', 'string', 'max:100'],
            'neighborhood' => ['sometimes', 'string', 'max:100'],
            'q' => ['sometimes', 'string', 'max:100'],
            'min_price' => ['sometimes', 'integer', 'min:0'],
            'max_price' => ['sometimes', 'integer', 'min:0'],
            'min_area' => ['sometimes', 'integer', 'min:0'],
            'min_bedrooms' => ['sometimes', 'integer', 'min:0', 'max:50'],
            'land_status' => ['sometimes', Rule::in(Property::LAND_STATUSES)],
            'amenities' => ['sometimes', 'array'],
            'amenities.*' => ['string', 'exists:amenities,slug'],
            'sort' => ['sometimes', Rule::in(['newest', 'price_asc', 'price_desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Property::published()
            ->with(self::RELATIONS)
            ->withCount('images')
            // when(valeur, fonction) : la condition ne s'applique que si le filtre est présent
            ->when($filters['transaction_type'] ?? null, fn ($q, $v) => $q->where('transaction_type', $v))
            ->when($filters['category'] ?? null, fn ($q, $v) => $q->whereHas('category', fn ($c) => $c->where('slug', $v)))
            ->when($filters['city'] ?? null, fn ($q, $v) => $q->where('city', $v))
            ->when($filters['neighborhood'] ?? null, fn ($q, $v) => $q->where('neighborhood', 'like', "%{$v}%"))
            ->when($filters['min_price'] ?? null, fn ($q, $v) => $q->where('price', '>=', $v))
            ->when($filters['max_price'] ?? null, fn ($q, $v) => $q->where('price', '<=', $v))
            ->when($filters['min_area'] ?? null, fn ($q, $v) => $q->where('built_area', '>=', $v))
            ->when($filters['min_bedrooms'] ?? null, fn ($q, $v) => $q->where('bedrooms', '>=', $v))
            ->when($filters['land_status'] ?? null, fn ($q, $v) => $q->where('land_status', $v))
            ->when($filters['q'] ?? null, function ($q, $v) {
                // Recherche libre dans le titre, le quartier, la ville et la référence
                $q->where(function ($w) use ($v) {
                    $w->where('title', 'like', "%{$v}%")
                        ->orWhere('neighborhood', 'like', "%{$v}%")
                        ->orWhere('city', 'like', "%{$v}%")
                        ->orWhere('reference', 'like', "%{$v}%");
                });
            });

        // Chaque équipement demandé doit être présent (ET, pas OU)
        foreach ($filters['amenities'] ?? [] as $slug) {
            $query->whereHas('amenities', fn ($a) => $a->where('slug', $slug));
        }

        switch ($filters['sort'] ?? 'newest') {
            case 'price_asc':
                $query->orderBy('price');
                break;
            case 'price_desc':
                $query->orderByDesc('price');
                break;
            default:
                // Les « coups de cœur » d'abord, puis les plus récents
                $query->orderByDesc('is_featured')->orderByDesc('published_at');
        }

        return PropertyResource::collection(
            $query->paginate($filters['per_page'] ?? 20)->withQueryString()
        );
    }

    // GET /api/properties/{reference} : fiche détaillée
    public function show(Property $property)
    {
        // Un bien non publié n'existe pas pour le public
        abort_unless($property->status === Property::STATUS_PUBLISHED, 404);

        $property->increment('views_count');
        $property->load(self::RELATIONS)->loadCount('images');

        return new PropertyResource($property);
    }

    // GET /api/properties/{reference}/similar : « Biens similaires »
    public function similar(Property $property)
    {
        abort_unless($property->status === Property::STATUS_PUBLISHED, 404);

        $similar = Property::published()
            ->where('id', '!=', $property->id)
            ->where('category_id', $property->category_id)
            ->where('city', $property->city)
            ->with(self::RELATIONS)
            ->withCount('images')
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();

        return PropertyResource::collection($similar);
    }
}