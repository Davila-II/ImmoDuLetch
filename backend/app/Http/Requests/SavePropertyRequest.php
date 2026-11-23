<?php

namespace App\Http\Requests;

use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SavePropertyRequest extends FormRequest
{
    // L'accès est déjà contrôlé par les routes (connexion) et la policy (propriétaire)
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // À la création, la catégorie et le type d'opération sont obligatoires.
        // Ensuite (étapes du formulaire), chaque champ est facultatif : « sometimes »
        // signifie « valider seulement si le champ est envoyé ».
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'category_id' => [$required, 'integer', 'exists:categories,id'],
            'transaction_type' => [$required, Rule::in(Property::TRANSACTION_TYPES)],
            'draft_step' => ['sometimes', 'integer', 'between:1,4'],

            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'price' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100000000000'],

            'city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'neighborhood' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],

            'built_area' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:1000000'],
            'land_area' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100000000'],
            'rooms' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
            'bedrooms' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
            'bathrooms' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
            'year_built' => ['sometimes', 'nullable', 'integer', 'between:1900,' . (date('Y') + 2)],

            'land_status' => ['sometimes', 'nullable', Rule::in(Property::LAND_STATUSES)],
            'land_title_number' => ['sometimes', 'nullable', 'string', 'max:50'],
            'virtual_tour_url' => ['sometimes', 'nullable', 'url', 'max:255'],

            // Liste des identifiants d'équipements, ex. [1, 2, 5]
            'amenities' => ['sometimes', 'array'],
            'amenities.*' => ['integer', 'exists:amenities,id'],
        ];
    }
}