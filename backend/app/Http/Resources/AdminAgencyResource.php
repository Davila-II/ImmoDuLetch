<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminAgencyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'rccm' => $this->rccm,
            'phone' => $this->phone,
            'email' => $this->email,
            'city' => $this->city,
            'address' => $this->address,
            'is_certified' => (bool) $this->is_certified,
            'members_count' => $this->whenCounted('members'),
            'properties_count' => $this->whenCounted('properties'),
            'members' => $this->whenLoaded('members', fn () => $this->members->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_agency_admin' => (bool) $user->is_agency_admin,
            ])),
            'created_at' => $this->created_at,
        ];
    }
}