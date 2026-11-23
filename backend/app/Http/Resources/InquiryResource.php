<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InquiryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'message' => $this->message,
            'visit_at' => $this->visit_at,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'property' => $this->whenLoaded('property', fn () => [
                'reference' => $this->property->reference,
                'title' => $this->property->title,
            ]),
        ];
    }
}