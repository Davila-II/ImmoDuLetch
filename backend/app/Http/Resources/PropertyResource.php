<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Utilisateur connecté, s'il envoie un jeton (même sur une route publique)
        $viewer = $request->user('sanctum');

        // Les champs privés ne sortent que pour le propriétaire du bien ou un administrateur
        $isMine = $viewer && ($viewer->id === $this->user_id || $viewer->isAdmin());

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'transaction_type' => $this->transaction_type,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'price_per_sqm' => $this->price_per_sqm,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'built_area' => $this->built_area,
            'land_area' => $this->land_area,
            'rooms' => $this->rooms,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'year_built' => $this->year_built,
            'land_status' => $this->land_status,
            'land_title_number' => $this->land_title_number,
            'is_exclusive' => (bool) $this->is_exclusive,
            'is_featured' => (bool) $this->is_featured,
            'virtual_tour_url' => $this->virtual_tour_url,
            'views_count' => $this->views_count,
            'published_at' => $this->published_at,

            // Présent seulement si l'utilisateur est connecté (le cœur des cartes)
            'is_favorite' => $this->when($viewer !== null, fn () => in_array($this->id, $this->favoriteIds($request, $viewer))),

            // Ces champs n'apparaissent que si la relation (ou le comptage) a été chargé
            'photos_count' => $this->whenCounted('images'),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'caption' => $image->caption,
                'position' => $image->position,
                'is_primary' => (bool) $image->is_primary,
            ])),
            'amenities' => $this->whenLoaded('amenities', fn () => $this->amenities->map(fn ($amenity) => [
                'id' => $amenity->id,
                'name' => $amenity->name,
                'slug' => $amenity->slug,
                'icon' => $amenity->icon,
            ])),
            // Pour les boutons « Appeler » et « WhatsApp »
            'contact' => $this->when($this->relationLoaded('owner'), fn () => [
                'name' => $this->agency?->name ?? $this->owner?->name,
                'phone' => $this->owner?->phone,
                'is_certified_agency' => (bool) $this->agency?->is_certified,
            ]),

            // Réservé au propriétaire du bien et aux administrateurs
            'status' => $this->when($isMine, $this->status),
            'draft_step' => $this->when($isMine, $this->draft_step),
            'address' => $this->when($isMine, $this->address),
            'latitude' => $this->when($isMine, $this->latitude),
            'longitude' => $this->when($isMine, $this->longitude),
            'contacts_count' => $this->when($isMine, $this->contacts_count),
            'rejection_reason' => $this->when($isMine, $this->rejection_reason),
            'created_at' => $this->when($isMine, $this->created_at),
        ];
    }

    // Identifiants des favoris de l'utilisateur, chargés une seule fois par requête
    // (et non une fois par bien de la liste)
    private function favoriteIds(Request $request, $viewer): array
    {
        $ids = $request->attributes->get('favorite_ids');

        if ($ids === null) {
            $ids = $viewer->favorites()->pluck('properties.id')->all();
            $request->attributes->set('favorite_ids', $ids);
        }

        return $ids;
    }
}