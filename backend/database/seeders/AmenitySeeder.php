<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['name' => "Forage d'eau fonctionnel", 'slug' => 'forage', 'icon' => 'water'],
            ['name' => 'Groupe électrogène / onduleur', 'slug' => 'groupe-electrogene', 'icon' => 'power'],
            ['name' => 'Raccordement Camwater', 'slug' => 'camwater', 'icon' => 'tap'],
            ['name' => 'Compteur Eneo individuel', 'slug' => 'eneo', 'icon' => 'bolt'],
            ['name' => 'Clôture sécurisée & gardée', 'slug' => 'cloture-securisee', 'icon' => 'shield'],
            ['name' => "Voie d'accès bitumée", 'slug' => 'voie-bitumee', 'icon' => 'road'],
            ['name' => 'Piscine privée', 'slug' => 'piscine', 'icon' => 'pool'],
            ['name' => 'Climatisation', 'slug' => 'climatisation', 'icon' => 'snowflake'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::updateOrCreate(['slug' => $amenity['slug']], $amenity);
        }
    }
}