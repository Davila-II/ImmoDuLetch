<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // On réutilise la fiche complète d'un bien (un administrateur voit déjà les
        // champs privés) et on y ajoute les informations utiles à la modération.
        return array_merge((new PropertyResource($this->resource))->resolve($request), [
            'expires_at' => $this->expires_at,
            'updated_at' => $this->updated_at,
            'owner' => $this->whenLoaded('owner', fn () => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
                'email' => $this->owner->email,
                'phone' => $this->owner->phone,
                'account_type' => $this->owner->account_type,
            ]),
            'agency' => $this->whenLoaded('agency', fn () => $this->agency ? [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
                'is_certified' => (bool) $this->agency->is_certified,
            ] : null),
        ]);
    }
}