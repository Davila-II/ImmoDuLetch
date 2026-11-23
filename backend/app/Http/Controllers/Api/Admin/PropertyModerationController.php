<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminPropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PropertyModerationController extends Controller
{
    // Durée de vie d'une annonce après validation (à confirmer avec le client)
    private const LISTING_DURATION_DAYS = 90;

    private const RELATIONS = [
        'category',
        'images',
        'amenities',
        'owner:id,name,email,phone,account_type',
        'agency:id,name,is_certified',
    ];

    // GET /api/admin/properties : file de modération (annonces en attente d'abord)
    public function index(Request $request)
    {
        $filters = $request->validate([
            'status' => ['sometimes', Rule::in(Property::STATUSES)],
            'q' => ['sometimes', 'string', 'max:100'],
            'agency_id' => ['sometimes', 'integer'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Property::with(self::RELATIONS)
            ->withCount('images')
            // Les brouillons sont privés tant que le propriétaire ne les a pas envoyés :
            // on ne les affiche que si l'administrateur les demande explicitement.
            ->when(
                $filters['status'] ?? null,
                fn ($q, $v) => $q->where('status', $v),
                fn ($q) => $q->where('status', '!=', Property::STATUS_DRAFT)
            )
            ->when($filters['agency_id'] ?? null, fn ($q, $v) => $q->where('agency_id', $v))
            ->when($filters['q'] ?? null, function ($q, $v) {
                // Recherche dans le bien (référence, titre, lieu) et chez son propriétaire
                $q->where(function ($w) use ($v) {
                    $w->where('reference', 'like', "%{$v}%")
                        ->orWhere('title', 'like', "%{$v}%")
                        ->orWhere('city', 'like', "%{$v}%")
                        ->orWhere('neighborhood', 'like', "%{$v}%")
                        ->orWhereHas('owner', fn ($o) => $o
                            ->where('name', 'like', "%{$v}%")
                            ->orWhere('email', 'like', "%{$v}%")
                            ->orWhere('phone', 'like', "%{$v}%"));
                });
            })
            // Les annonces à traiter en premier, puis les plus récemment modifiées
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->latest('updated_at');

        return AdminPropertyResource::collection(
            $query->paginate($filters['per_page'] ?? 20)->withQueryString()
        );
    }

    // GET /api/admin/properties/{reference}
    public function show(Property $property)
    {
        return $this->respond($property);
    }

    // POST /api/admin/properties/{reference}/approve : en attente -> publiée
    public function approve(Property $property)
    {
        return $this->transition($property, [Property::STATUS_PENDING], Property::STATUS_PUBLISHED, [
            'published_at' => now(),
            'expires_at' => now()->addDays(self::LISTING_DURATION_DAYS),
            'rejection_reason' => null,
        ]);
    }

    // POST /api/admin/properties/{reference}/reject : en attente -> refusée (motif obligatoire)
    public function reject(Request $request, Property $property)
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        // Le propriétaire verra ce motif dans « Mes annonces » et pourra corriger son annonce
        return $this->transition($property, [Property::STATUS_PENDING], Property::STATUS_REJECTED, [
            'rejection_reason' => $data['reason'],
        ]);
    }

    // POST /api/admin/properties/{reference}/suspend : publiée -> suspendue
    public function suspend(Request $request, Property $property)
    {
        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        // On réutilise la colonne « rejection_reason » pour le motif de suspension
        return $this->transition($property, [Property::STATUS_PUBLISHED], Property::STATUS_SUSPENDED, [
            'rejection_reason' => $data['reason'] ?? null,
        ]);
    }

    // POST /api/admin/properties/{reference}/reinstate : suspendue -> publiée
    public function reinstate(Property $property)
    {
        return $this->transition($property, [Property::STATUS_SUSPENDED], Property::STATUS_PUBLISHED, [
            'rejection_reason' => null,
        ]);
    }

    // PATCH /api/admin/properties/{reference}/flags : mises en avant réservées à l'administrateur
    public function flags(Request $request, Property $property)
    {
        $data = $request->validate([
            'is_exclusive' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ]);

        // forceFill : ces champs ne sont pas dans $fillable, un propriétaire ne peut pas les modifier
        $property->forceFill($data)->save();

        return $this->respond($property);
    }

    // Change le statut si (et seulement si) le statut actuel est autorisé pour cette action
    private function transition(Property $property, array $from, string $to, array $attributes = [])
    {
        if (! in_array($property->status, $from, true)) {
            return response()->json([
                'message' => "Action impossible : l'annonce est actuellement « {$property->status} ».",
            ], 409);
        }

        $property->forceFill(['status' => $to] + $attributes)->save();

        return $this->respond($property);
    }

    private function respond(Property $property): AdminPropertyResource
    {
        return new AdminPropertyResource($property->load(self::RELATIONS)->loadCount('images'));
    }
}