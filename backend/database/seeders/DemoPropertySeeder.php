<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Amenity;
use App\Models\Category;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\ImageManager;

class DemoPropertySeeder extends Seeder
{
    public function run(): void
    {
        $manager = new ImageManager(new GdDriver());

        // 1. Agence Letch Prestige
        $agency = Agency::firstOrCreate(
            ['rccm' => 'RC/DLA/2021/B/1480'],
            [
                'name' => 'Letch Prestige Immobilier',
                'phone' => '+237 699 45 28 10',
                'email' => 'contact@immoduletch.cm',
                'city' => 'Douala',
                'address' => 'Bonanjo, Rue Joss',
                'is_certified' => true,
            ]
        );

        // 2. Utilisateurs Démo
        $agentUser = User::firstOrCreate(
            ['email' => 'jean-marc@immoduletch.cm'],
            [
                'name' => 'Jean-Marc Letch',
                'phone' => '+237 699 45 28 10',
                'password' => Hash::make('secret123'),
                'account_type' => 'agence',
                'agency_id' => $agency->id,
                'is_agency_admin' => true,
            ]
        );

        $particularUser = User::firstOrCreate(
            ['email' => 'proprietaire@example.cm'],
            [
                'name' => 'Paul Ewane',
                'phone' => '+237 677 00 11 22',
                'password' => Hash::make('secret123'),
                'account_type' => 'particulier',
            ]
        );

        // Récupérer catégories & équipements
        $categories = Category::all()->keyBy('slug');
        $amenities = Amenity::all()->keyBy('slug');

        // Palette de couleurs pour générer de jolies images locales WebP
        $colorThemes = [
            ['bg' => [10, 25, 49], 'accent' => [245, 166, 35]],     // Nuit & Doré
            ['bg' => [26, 44, 76], 'accent' => [52, 211, 153]],    // Bleu & Émeraude
            ['bg' => [44, 62, 80], 'accent' => [241, 196, 15]],    // Slate & Ambre
            ['bg' => [15, 23, 42], 'accent' => [56, 189, 248]],    // Dark & Cyan
            ['bg' => [30, 41, 59], 'accent' => [251, 146, 60]],    // Charcoal & Orange
            ['bg' => [20, 83, 45], 'accent' => [250, 204, 21]],    // Forest & Gold
        ];

        // 3. Catalogue des 6 Biens des Maquettes
        $propertiesData = [
            [
                'reference' => 'CMR-942810',
                'user_id' => $agentUser->id,
                'agency_id' => $agency->id,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => 'Superbe Villa Duplex Contemporaine avec Piscine & Forage',
                'description' => "Située au cœur du quartier résidentiel diplomatique de Bastos à Yaoundé, à proximité immédiate des représentations diplomatiques et commodités internationales, cette somptueuse villa duplex contemporaine offre une symbiose parfaite entre modernité, confort absolu et sérénité tropicale.\n\nÉrigée sur une parcelle titrée de 1 200 m² entièrement clôturée avec guérite de sécurité et vidéosurveillance, la villa dispose d'une autonomie totale en eau et énergie grâce à un forage profond équipé de surpresseur et filtration avec bâche tampon de 5 000 L, ainsi qu'un groupe électrogène automatique insonorisé de 25 kVA en relais du réseau Eneo.\n\nLe rez-de-chaussée s'ouvre sur un double séjour traversant lumineux donnant sur la piscine privative et sa terrasse aménagée, une cuisine moderne équipée avec îlot central et buanderie. À l'étage, une suite parentale magistrale avec dressing et salle de bains balnéo, accompagnée de 4 spacieuses chambres autonomes avec balcons privatifs.",
                'price' => 380000000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Bastos (Ambassades)',
                'address' => 'Rue Joseph Mballa, Face Résidence Ambassade',
                'built_area' => 380,
                'land_area' => 1200,
                'rooms' => 7,
                'bedrooms' => 5,
                'bathrooms' => 5,
                'year_built' => 2022,
                'land_status' => 'title_available',
                'land_title_number' => '14820/Mfoundi',
                'is_exclusive' => true,
                'is_featured' => true,
                'amenities' => ['forage', 'groupe-electrogene', 'camwater', 'eneo', 'cloture-securisee', 'voie-bitumee', 'piscine', 'climatisation'],
            ],
            [
                'reference' => 'CMR-320015',
                'user_id' => $agentUser->id,
                'agency_id' => $agency->id,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => "Villa d'Architecte Contemporaine avec Piscine & Jardin Tropical",
                'description' => "Rare opportunité à Bonapriso, quartier d'affaires et résidentiel le plus recherché de Douala. Propriété neuve de haut standing disposant d'un jardin paysager soigné, piscine avec plage en teck, finitions soignées en marbre et baies vitrées toute hauteur double vitrage.\n\nForage autonome, groupe électrogène 20 kVA avec inverseur automatique, raccordement Eneo et Camwater aux normes, clôture de 2,80 m avec barbelés concertina et guérite de gardiennage H24.",
                'price' => 320000000,
                'city' => 'Douala',
                'neighborhood' => 'Bonapriso',
                'address' => 'Rue Tokoto, proche Tennis Club',
                'built_area' => 280,
                'land_area' => 850,
                'rooms' => 6,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'year_built' => 2023,
                'land_status' => 'title_available',
                'land_title_number' => '8942/Wouri',
                'is_exclusive' => true,
                'is_featured' => true,
                'amenities' => ['forage', 'groupe-electrogene', 'cloture-securisee', 'voie-bitumee', 'piscine', 'climatisation'],
            ],
            [
                'reference' => 'CMR-180042',
                'user_id' => $agentUser->id,
                'agency_id' => $agency->id,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'sale',
                'title' => "Penthouse Duplex d'Exception avec Terrasse Panoramique Vue Wouri",
                'description' => "Vue imprenable et dégagée sur le fleuve Wouri et le port d'affaires de Douala. Ce penthouse d'exception occupe les 5ème et 6ème étages d'une copropriété sécurisée et haut de gamme à Bonanjo.\n\nVaste salon d'angle baigné de lumière naturelle, cuisine américaine équipée de marque allemande, 3 suites avec terrasses privatives et grand rooftop de 95 m² aménageable en lounge d'extérieur.",
                'price' => 180000000,
                'city' => 'Douala',
                'neighborhood' => 'Bonanjo',
                'address' => 'Avenue Charles de Gaulle',
                'built_area' => 190,
                'land_area' => 95,
                'rooms' => 5,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'year_built' => 2021,
                'land_status' => 'document_verified',
                'land_title_number' => 'Copropriété TF 3410/Wouri',
                'is_exclusive' => false,
                'is_featured' => true,
                'amenities' => ['groupe-electrogene', 'camwater', 'eneo', 'cloture-securisee', 'climatisation'],
            ],
            [
                'reference' => 'CMR-075021',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['terrain-titre']->id ?? 3,
                'transaction_type' => 'sale',
                'title' => 'Terrain Titré Vue Mer Pieds dans l’Eau à Kribi (Route des Chutes)',
                'description' => "Parcelle exceptionnelle de 1 200 m² en bordure directe de plage sur la côte atlantique de Kribi, route des chutes de la Lobé. Emplacement stratégique pour résidence balnéaire de villégiature, projet d'éco-lodge touristique ou maison de maître.\n\nFaçade maritime de 35 mètres linéaires sur sable blanc. Dossier cadastral irréprochable avec titre foncier individuel libre de toute hypothèque ou litige coutumier. Bornage contradictoire certifié par géomètre assermenté.",
                'price' => 75000000,
                'city' => 'Kribi',
                'neighborhood' => 'Zone Balnéaire (Lobé)',
                'address' => 'Route des Chutes de la Lobé',
                'built_area' => null,
                'land_area' => 1200,
                'rooms' => null,
                'bedrooms' => null,
                'bathrooms' => null,
                'year_built' => null,
                'land_status' => 'title_available',
                'land_title_number' => '5120/Océan',
                'is_exclusive' => true,
                'is_featured' => false,
                'amenities' => ['voie-bitumee', 'eneo'],
            ],
            [
                'reference' => 'CMR-280064',
                'user_id' => $agentUser->id,
                'agency_id' => $agency->id,
                'category_id' => $categories['immeuble-bureau']->id ?? 4,
                'transaction_type' => 'sale',
                'title' => 'Immeuble de Rapport R+3 • 8 Appartements Entièrement Loués (Akwa Centre)',
                'description' => "Actif patrimonial à fort rendement locatif situé en plein centre commercial d'Akwa à Douala. Monopropriété R+3 comprenant 8 appartements de type T3/T4 et 2 locaux commerciaux en rez-de-chaussée.\n\nLoyers annuels perçus : 25 760 000 FCFA avec un taux d'occupation de 100%. Rendement brut constaté supérieur à 9,2%. Chaque lot dispose de compteurs Eneo prépayés et sous-compteurs Camwater individuels.",
                'price' => 280000000,
                'city' => 'Douala',
                'neighborhood' => 'Akwa Centre',
                'address' => 'Boulevard de la Liberté',
                'built_area' => 460,
                'land_area' => 500,
                'rooms' => 18,
                'bedrooms' => 12,
                'bathrooms' => 8,
                'year_built' => 2019,
                'land_status' => 'title_available',
                'land_title_number' => '7140/Wouri',
                'is_exclusive' => false,
                'is_featured' => true,
                'amenities' => ['forage', 'groupe-electrogene', 'camwater', 'eneo', 'voie-bitumee'],
            ],
            [
                'reference' => 'CMR-145033',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'rent',
                'title' => 'Appartement Meublé Haut Standing avec Balcon & Groupe Électrogène',
                'description' => "Location meublée haut standing à Yaoundé Bastos, secteur très sécurisé. Décoration contemporaine et équipements complets (literie hôtelière grand confort, smart TV, internet fibre optique, climatisation intégrale).\n\nImmeuble avec ascenseur, gardiennage H24, groupe électrogène automatique et forage filtré. Idéal pour diplomates, cadres de multinationales et consultants en mission.",
                'price' => 1200000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Bastos',
                'address' => 'Rue des Ambassades',
                'built_area' => 140,
                'land_area' => 140,
                'rooms' => 4,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'year_built' => 2022,
                'land_status' => 'document_verified',
                'land_title_number' => null,
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['forage', 'groupe-electrogene', 'camwater', 'eneo', 'cloture-securisee', 'climatisation'],
            ],
        ];

        foreach ($propertiesData as $index => $prop) {
            $amenitySlugs = $prop['amenities'];
            unset($prop['amenities']);

            $property = Property::updateOrCreate(
                ['reference' => $prop['reference']],
                $prop + [
                    'status' => Property::STATUS_PUBLISHED,
                    'views_count' => random_int(450, 2400),
                    'contacts_count' => random_int(12, 48),
                    'published_at' => now()->subDays(random_int(2, 30)),
                ]
            );

            // Synchroniser les équipements
            $amenityIds = collect($amenitySlugs)->map(fn ($s) => $amenities[$s]->id ?? null)->filter()->values();
            $property->amenities()->sync($amenityIds);

            // Générer 3 belles images WebP locales si le bien n'a pas encore de photos
            if ($property->images()->count() === 0) {
                $theme = $colorThemes[$index % count($colorThemes)];
                for ($p = 0; $p < 3; $p++) {
                    $img = $manager->create(1200, 800)->fill(sprintf('rgb(%d,%d,%d)', $theme['bg'][0], $theme['bg'][1], $theme['bg'][2]));

                    // Tracé géométrique / architecture moderne pour simuler un visuel immobilier
                    $img->drawRectangle(100 + ($p * 40), 100, function ($draw) use ($theme) {
                        $draw->size(1000, 600);
                        $draw->border(sprintf('rgb(%d,%d,%d)', $theme['accent'][0], $theme['accent'][1], $theme['accent'][2]), 4);
                    });

                    $path = "properties/{$property->id}/demo-photo-{$p}.webp";
                    $encoded = $img->toWebp(85);
                    Storage::disk('public')->put($path, (string) $encoded);

                    $property->images()->create([
                        'path' => $path,
                        'caption' => $p === 0 ? 'Vue principale' : ($p === 1 ? 'Espace de réception' : 'Suite parentale'),
                        'position' => $p,
                        'is_primary' => ($p === 0),
                    ]);
                }
            }
        }

        $this->command->info('Données de démonstration (biens, agence, utilisateurs et photos WebP) générées avec succès !');
    }
}
