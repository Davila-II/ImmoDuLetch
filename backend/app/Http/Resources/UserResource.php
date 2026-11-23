<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'account_type' => $this->account_type,
            'role' => $this->role,
            'is_agency_admin' => (bool) $this->is_agency_admin,
            'avatar_url' => $this->avatar_path ? Storage::url($this->avatar_path) : null,
            // Inclus seulement si la relation a été chargée avec ->load('agency')
            'agency' => $this->whenLoaded('agency', fn () => $this->agency ? [
                'id' => $this->agency->id,
                'name' => $this->agency->name,
                'is_certified' => (bool) $this->agency->is_certified,
            ] : null),
            'created_at' => $this->created_at,
        ];
    }
}