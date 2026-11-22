<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Villa / Duplex', 'slug' => 'villa-duplex', 'icon' => 'home'],
            ['name' => 'Appartement / Studio', 'slug' => 'appartement-studio', 'icon' => 'building'],
            ['name' => 'Terrain titré / Parcelle', 'slug' => 'terrain-titre', 'icon' => 'map'],
            ['name' => 'Immeuble / Bureau', 'slug' => 'immeuble-bureau', 'icon' => 'office'],
            ['name' => 'Commerce / Local', 'slug' => 'commerce-local', 'icon' => 'store'],
        ];

        // updateOrCreate : on peut relancer le seeder sans créer de doublons
        foreach ($categories as $index => $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category + ['position' => $index + 1]
            );
        }
    }
}