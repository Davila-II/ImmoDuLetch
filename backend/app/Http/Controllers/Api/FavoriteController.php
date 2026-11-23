<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // GET /api/favorites : « Mes favoris », les plus récents d'abord
    public function index(Request $request)
    {
        $properties = $request->user()->favorites()
            ->published() // un bien dépublié disparaît de la liste (sans être retiré de la base)
            ->with(['category', 'images', 'amenities', 'owner:id,name,phone', 'agency:id,name,is_certified'])
            ->withCount('images')
            ->orderByPivot('created_at', 'desc')
            ->paginate(20);

        return PropertyResource::collection($properties);
    }

    // PUT /api/properties/{reference}/favorite : ajoute (répéter l'appel ne fait rien de plus)
    public function store(Request $request, Property $property)
    {
        abort_unless($property->status === Property::STATUS_PUBLISHED, 404);

        // syncWithoutDetaching : ajoute sans doublon et sans retirer les autres favoris
        $request->user()->favorites()->syncWithoutDetaching([$property->id]);

        return response()->json(['is_favorite' => true]);
    }

    // DELETE /api/properties/{reference}/favorite : retire
    public function destroy(Request $request, Property $property)
    {
        $request->user()->favorites()->detach($property->id);

        return response()->json(['is_favorite' => false]);
    }
}