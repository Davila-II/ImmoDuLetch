<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;

class PropertyImageController extends Controller
{
    private const MAX_PHOTOS = 30;   // photos maximum par annonce
    private const MAX_SIDE_PX = 2000; // la plus grande dimension est ramenée à 2000 px

    // POST /api/my/properties/{reference}/images : envoie une ou plusieurs photos
    public function store(Request $request, Property $property)
    {
        Gate::authorize('manage', $property);

        $request->validate([
            'images' => ['required', 'array', 'min:1', 'max:20'],
            // max:12288 = 12 Mo par photo. Le type est vérifié sur le contenu réel du fichier.
            'images.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
        ]);

        $files = $request->file('images');
        $existing = $property->images()->count();

        if ($existing + count($files) > self::MAX_PHOTOS) {
            throw ValidationException::withMessages([
                'images' => ['Une annonce peut avoir au maximum ' . self::MAX_PHOTOS . ' photos.'],
            ]);
        }

        $next = $existing > 0 ? (int) $property->images()->max('position') + 1 : 0;

        // On utilise Intervention directement, avec le moteur GD de PHP,
        // sans passer par une façade qui pourrait entrer en conflit avec Laravel.
        $manager = new ImageManager(new GdDriver());

        foreach ($files as $file) {
            // On redimensionne (sans jamais agrandir) puis on convertit en WebP :
            // des fichiers 3 à 10 fois plus légers, important pour le mobile.
            $encoded = $manager->read($file->getRealPath())
                ->scaleDown(width: self::MAX_SIDE_PX, height: self::MAX_SIDE_PX)
                ->toWebp(quality: 80);

            // Nom aléatoire : on ne garde jamais le nom du fichier envoyé par l'utilisateur
            $path = "properties/{$property->id}/" . Str::uuid() . '.webp';
            Storage::disk('public')->put($path, (string) $encoded);

            $property->images()->create([
                'path' => $path,
                'position' => $next++,
                'is_primary' => false,
            ]);
        }

        $this->normalize($property);

        return $this->respond($property)->response()->setStatusCode(201);
    }

    // PATCH /api/my/properties/{reference}/images/{image} : modifie la légende
    public function update(Request $request, Property $property, PropertyImage $image)
    {
        Gate::authorize('manage', $property);
        abort_unless($image->property_id === $property->id, 404);

        $data = $request->validate([
            'caption' => ['nullable', 'string', 'max:100'],
        ]);

        $image->update($data);

        return $this->respond($property);
    }

    // PUT /api/my/properties/{reference}/images/order : réordonne les photos
    // Corps : {"order": [id3, id1, id2]}. La première devient la photo principale.
    public function reorder(Request $request, Property $property)
    {
        Gate::authorize('manage', $property);

        $data = $request->validate([
            'order' => ['required', 'array', 'min:1'],
            'order.*' => ['integer', 'distinct'],
        ]);

        $ids = $property->images()->pluck('id')->all();

        // La liste doit contenir exactement les photos de ce bien, ni plus ni moins
        if (
            count($data['order']) !== count($ids)
            || array_diff($ids, $data['order'])
            || array_diff($data['order'], $ids)
        ) {
            throw ValidationException::withMessages([
                'order' => ['La liste doit contenir toutes les photos de l\'annonce, une seule fois chacune.'],
            ]);
        }

        foreach ($data['order'] as $position => $id) {
            PropertyImage::where('property_id', $property->id)
                ->whereKey($id)
                ->update(['position' => $position, 'is_primary' => $position === 0]);
        }

        return $this->respond($property);
    }

    // DELETE /api/my/properties/{reference}/images/{image}
    public function destroy(Property $property, PropertyImage $image)
    {
        Gate::authorize('manage', $property);
        abort_unless($image->property_id === $property->id, 404);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        // Si on a supprimé la photo principale, la suivante prend sa place
        $this->normalize($property);

        return $this->respond($property);
    }

    // Réécrit les positions 0, 1, 2... et marque la première photo comme principale
    private function normalize(Property $property): void
    {
        $images = $property->images()->reorder()->orderBy('position')->orderBy('id')->get();

        foreach ($images as $index => $image) {
            $image->update(['position' => $index, 'is_primary' => $index === 0]);
        }
    }

    private function respond(Property $property): PropertyResource
    {
        $property->load(['category', 'images', 'amenities'])->loadCount('images');

        return new PropertyResource($property);
    }
}