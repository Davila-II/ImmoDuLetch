<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SavePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MyPropertyController extends Controller
{
    // Nombre minimum de photos pour envoyer une annonce en validation
    private const MIN_PHOTOS_TO_SUBMIT = 3;

    // GET /api/my/properties : « Mes annonces » avec les compteurs du tableau de bord
    public function index(Request $request)
    {
        $request->validate([
            'status' => ['sometimes', Rule::in(Property::STATUSES)],
        ]);

        $user = $request->user();

        $query = $user->properties()
            ->with(['category', 'images'])
            ->withCount('images')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest();

        // Compteurs affichés en haut de l'écran : vues totales, contacts reçus
        $totals = $user->properties()
            ->selectRaw('COUNT(*) as total, COALESCE(SUM(views_count), 0) as views, COALESCE(SUM(contacts_count), 0) as contacts')
            ->first();

        return PropertyResource::collection($query->paginate(20))
            ->additional(['stats' => [
                'total' => (int) $totals->total,
                'views' => (int) $totals->views,
                'contacts' => (int) $totals->contacts,
            ]]);
    }

    // POST /api/my/properties : crée un brouillon (étape 1 du formulaire)
    public function store(SavePropertyRequest $request)
    {
        $data = $request->validated();
        $amenities = $data['amenities'] ?? null;
        unset($data['amenities']);

        // make() remplit user_id automatiquement grâce à la relation
        $property = $request->user()->properties()->make($data);
        // Champs attribués par le code, jamais par la requête
        $property->agency_id = $request->user()->agency_id;
        $property->status = Property::STATUS_DRAFT;
        $property->save();

        if ($amenities !== null) {
            $property->amenities()->sync($amenities);
        }

        $property->refresh()->load(['category', 'images', 'amenities']);

        return (new PropertyResource($property))->response()->setStatusCode(201);
    }

    // GET /api/my/properties/{reference}
    public function show(Property $property)
    {
        Gate::authorize('manage', $property);

        $property->load(['category', 'images', 'amenities'])->loadCount('images');

        return new PropertyResource($property);
    }

    // PUT /api/my/properties/{reference} : met à jour (une étape du formulaire à la fois)
    public function update(SavePropertyRequest $request, Property $property)
    {
        Gate::authorize('manage', $property);

        $data = $request->validated();
        $amenities = $data['amenities'] ?? null;
        unset($data['amenities']);

        $property->fill($data);

        // Une annonce publiée qui est modifiée repasse en validation ;
        // une annonce refusée redevient un brouillon à corriger.
        if ($property->status === Property::STATUS_PUBLISHED) {
            $property->status = Property::STATUS_PENDING;
        } elseif ($property->status === Property::STATUS_REJECTED) {
            $property->status = Property::STATUS_DRAFT;
            $property->rejection_reason = null;
        }

        $property->save();

        if ($amenities !== null) {
            $property->amenities()->sync($amenities);
        }

        $property->load(['category', 'images', 'amenities'])->loadCount('images');

        return new PropertyResource($property);
    }

    // DELETE /api/my/properties/{reference}
    public function destroy(Property $property)
    {
        Gate::authorize('manage', $property);

        $property->delete(); // suppression douce : la ligne reste en base

        return response()->noContent();
    }

    // POST /api/my/properties/{reference}/submit : envoi pour validation
    public function submit(Property $property)
    {
        Gate::authorize('manage', $property);

        if (! in_array($property->status, [Property::STATUS_DRAFT, Property::STATUS_REJECTED], true)) {
            return response()->json([
                'message' => 'Cette annonce ne peut pas être envoyée en validation dans son état actuel.',
            ], 409);
        }

        // Une annonce doit être complète pour être envoyée
        Validator::make($property->only([
            'category_id', 'transaction_type', 'title', 'description',
            'price', 'city', 'neighborhood', 'land_status',
        ]), [
            'category_id' => ['required'],
            'transaction_type' => ['required'],
            'title' => ['required'],
            'description' => ['required'],
            'price' => ['required', 'integer', 'min:1'],
            'city' => ['required'],
            'neighborhood' => ['required'],
            'land_status' => ['required'],
        ])->validate();

        if (! $property->built_area && ! $property->land_area) {
            throw ValidationException::withMessages([
                'built_area' => ['Indiquez la surface bâtie ou la superficie du terrain.'],
            ]);
        }

        if ($property->images()->count() < self::MIN_PHOTOS_TO_SUBMIT) {
            throw ValidationException::withMessages([
                'images' => ['Ajoutez au moins ' . self::MIN_PHOTOS_TO_SUBMIT . ' photos avant d\'envoyer l\'annonce.'],
            ]);
        }

        $property->status = Property::STATUS_PENDING;
        $property->draft_step = 4;
        $property->rejection_reason = null;
        $property->save();

        return new PropertyResource($property->load(['category', 'images', 'amenities']));
    }
}