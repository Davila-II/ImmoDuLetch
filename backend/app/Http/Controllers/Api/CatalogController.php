<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    // Catégories avec le nombre de biens publiés (« Villas : 3 420 biens »)
    public function categories(): JsonResponse
    {
        $categories = Category::select(['id', 'name', 'slug', 'icon'])
            ->withCount(['properties as properties_count' => fn ($query) => $query->published()])
            ->orderBy('position')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function amenities(): JsonResponse
    {
        return response()->json([
            'data' => Amenity::select(['id', 'name', 'slug', 'icon'])->orderBy('id')->get(),
        ]);
    }
}