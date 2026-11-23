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

        // 1. Agences
        $agencyLetch = Agency::firstOrCreate(
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

        $agencyCroisette = Agency::firstOrCreate(
            ['rccm' => 'RC/YDE/2019/B/5512'],
            [
                'name' => 'Croisette Immo & Régie Foncière',
                'phone' => '+237 677 44 55 66',
                'email' => 'contact@croisette-immo.cm',
                'city' => 'Yaoundé',
                'address' => 'Bastos, face Ambassade USA',
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
                'agency_id' => $agencyLetch->id,
                'is_agency_admin' => true,
            ]
        );

        $agentCroisette = User::firstOrCreate(
            ['email' => 'sophie@croisette-immo.cm'],
            [
                'name' => 'Sophie Kouam',
                'phone' => '+237 677 44 55 66',
                'password' => Hash::make('secret123'),
                'account_type' => 'agence',
                'agency_id' => $agencyCroisette->id,
                'is_agency_admin' => false,
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

        // Catégories & Équipements
        $categories = Category::all()->keyBy('slug');
        $amenities = Amenity::all()->keyBy('slug');

        $colorThemes = [
            ['bg' => [10, 25, 49], 'accent' => [245, 166, 35]],     // Nuit & Doré
            ['bg' => [26, 44, 76], 'accent' => [52, 211, 153]],    // Bleu & Émeraude
            ['bg' => [44, 62, 80], 'accent' => [241, 196, 15]],    // Slate & Ambre
            ['bg' => [15, 23, 42], 'accent' => [56, 189, 248]],    // Dark & Cyan
            ['bg' => [30, 41, 59], 'accent' => [251, 146, 60]],    // Charcoal & Orange
            ['bg' => [20, 83, 45], 'accent' => [250, 204, 21]],    // Forest & Gold
            ['bg' => [38, 20, 50], 'accent' => [236, 72, 153]],    // Plum & Rose
            ['bg' => [18, 53, 36], 'accent' => [34, 197, 94]],     // Pine & Green
        ];

        // 3. Catalogue étendu de 15 Biens d'exception
        $propertiesData = [
            // --- VILLAS & DUPLEX ---
            [
                'reference' => 'CMR-942810',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => 'Superbe Villa Duplex Contemporaine avec Piscine & Forage',
                'description' => "Située au cœur du quartier résidentiel diplomatique de Bastos à Yaoundé, cette villa offre modernité, confort absolu et sérénité tropicale. Parcelle titrée de 1 200 m² entièrement clôturée avec guérite de sécurité. Forage profond équipé avec bâche de 5 000 L et groupe électrogène automatique 25 kVA.",
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
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => "Villa d'Architecte Contemporaine avec Piscine & Jardin Tropical",
                'description' => "Rare opportunité à Bonapriso, quartier résidentiel haut de gamme de Douala. Propriété neuve de prestige avec jardin paysager, piscine, finitions en marbre, forage autonome et groupe 20 kVA.",
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
                'reference' => 'CMR-260018',
                'user_id' => $agentCroisette->id,
                'agency_id' => $agencyCroisette->id,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => 'Villa de Maître avec Grand Jardin Tropical & Dépendances',
                'description' => "Propriété de caractère dans le secteur calme du Golf à Yaoundé. Vaste terrain arboré de 1 500 m², terrasse couverte avec vue dégagée, quartier calme et très sécurisé.",
                'price' => 260000000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Golf',
                'address' => 'Avenue du Golf Club',
                'built_area' => 350,
                'land_area' => 1500,
                'rooms' => 7,
                'bedrooms' => 5,
                'bathrooms' => 4,
                'year_built' => 2020,
                'land_status' => 'title_available',
                'land_title_number' => '11200/Mfoundi',
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['forage', 'groupe-electrogene', 'cloture-securisee', 'voie-bitumee'],
            ],
            [
                'reference' => 'CMR-195022',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['villa-duplex']->id ?? 1,
                'transaction_type' => 'sale',
                'title' => 'Duplex Moderne 5 Chambres avec Guérite & Groupe',
                'description' => "Magnifique duplex familial à Yassa (Douala), accès rapide autoroute et aéroport. Finitions modernes soignées, bâche à eau avec suppresseur, espace barbecue extérieur.",
                'price' => 195000000,
                'city' => 'Douala',
                'neighborhood' => 'Yassa',
                'address' => 'Cité des Cadres',
                'built_area' => 260,
                'land_area' => 600,
                'rooms' => 6,
                'bedrooms' => 5,
                'bathrooms' => 3,
                'year_built' => 2023,
                'land_status' => 'document_verified',
                'land_title_number' => 'TF 4120/Sanaga-Maritime',
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['forage', 'groupe-electrogene', 'cloture-securisee', 'climatisation'],
            ],

            // --- APPARTEMENTS & STUDIOS ---
            [
                'reference' => 'CMR-180042',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'sale',
                'title' => "Penthouse Duplex d'Exception avec Terrasse Panoramique Vue Wouri",
                'description' => "Vue imprenable et dégagée sur le fleuve Wouri. Ce penthouse d'exception occupe les 5ème et 6ème étages d'une copropriété sécurisée et haut de gamme à Bonanjo avec rooftop de 95 m².",
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
                'reference' => 'CMR-125010',
                'user_id' => $agentCroisette->id,
                'agency_id' => $agencyCroisette->id,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'sale',
                'title' => 'Appartement Haut Standing 3 Chambres Terrasse à Bastos',
                'description' => "Idéal pour résidence principale ou investissement locatif meublé. Résidence sécurisée avec ascenseur, conciergerie et parking souterrain.",
                'price' => 125000000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Bastos',
                'address' => 'Rue Joseph Mbarga',
                'built_area' => 115,
                'land_area' => 115,
                'rooms' => 4,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'year_built' => 2024,
                'land_status' => 'title_available',
                'land_title_number' => '13400/Mfoundi',
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['forage', 'groupe-electrogene', 'cloture-securisee', 'climatisation'],
            ],
            [
                'reference' => 'CMR-145033',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'rent',
                'title' => 'Appartement Meublé Standing avec Balcon & Groupe Électrogène',
                'description' => "Location meublée haut standing à Yaoundé Bastos, secteur très sécurisé. Décoration contemporaine et équipements complets, groupe automatique et forage.",
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
            [
                'reference' => 'CMR-085040',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['appartement-studio']->id ?? 2,
                'transaction_type' => 'rent',
                'title' => 'Studio Meublé VIP Design à Bonapriso Douala',
                'description' => "Studio ultra-moderne tout équipé pour séjours d'affaires ou expatriation. Cuisine américaine, wifi fibre, piscine commune et sécurité 24/7.",
                'price' => 650000,
                'city' => 'Douala',
                'neighborhood' => 'Bonapriso',
                'address' => 'Rue Njo-Njo',
                'built_area' => 55,
                'land_area' => 55,
                'rooms' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'year_built' => 2023,
                'land_status' => 'document_verified',
                'land_title_number' => null,
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['groupe-electrogene', 'piscine', 'climatisation', 'cloture-securisee'],
            ],

            // --- TERRAINS TITRÉS / PARCELLES ---
            [
                'reference' => 'CMR-075021',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['terrain-titre']->id ?? 3,
                'transaction_type' => 'sale',
                'title' => 'Terrain Titré Vue Mer Pieds dans l’Eau à Kribi (Route des Chutes)',
                'description' => "Parcelle de 1 200 m² en bordure directe de plage sur la côte atlantique de Kribi, route des chutes de la Lobé. Façade maritime de 35 mètres linéaires. Titre foncier individuel libre de tout litige.",
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
                'reference' => 'CMR-120090',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['terrain-titre']->id ?? 3,
                'transaction_type' => 'sale',
                'title' => 'Projet de Lotissement Sécurisé • Parcelle Titrée 5 000 m² à Yassa',
                'description' => "Superbe lotissement viabilisé morcelable à partir de 500 m². Voies de 12 mètres ouvertes, raccordements Eneo à proximité immédiate, titre foncier mère net.",
                'price' => 120000000,
                'city' => 'Douala',
                'neighborhood' => 'Yassa',
                'address' => 'Entrée Cité Chinoise',
                'built_area' => null,
                'land_area' => 5000,
                'rooms' => null,
                'bedrooms' => null,
                'bathrooms' => null,
                'year_built' => null,
                'land_status' => 'title_available',
                'land_title_number' => '9840/Sanaga-Maritime',
                'is_exclusive' => true,
                'is_featured' => true,
                'amenities' => ['voie-bitumee', 'eneo'],
            ],
            [
                'reference' => 'CMR-045055',
                'user_id' => $particularUser->id,
                'agency_id' => null,
                'category_id' => $categories['terrain-titre']->id ?? 3,
                'transaction_type' => 'sale',
                'title' => 'Parcelle Titrée Viabilisée 800 m² à Odza Yaoundé',
                'description' => "Terrain plat prêt à bâtir dans une zone résidentielle en plein essor à Odza. Quartier calme, bornage contradictoire fait, documents disponibles pour vérification notariée.",
                'price' => 48000000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Odza',
                'address' => 'Derrière Complexe Scolaire',
                'built_area' => null,
                'land_area' => 800,
                'rooms' => null,
                'bedrooms' => null,
                'bathrooms' => null,
                'year_built' => null,
                'land_status' => 'title_available',
                'land_title_number' => '16200/Mfoundi',
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['camwater', 'eneo'],
            ],

            // --- IMMEUBLES DE RAPPORT & BUREAUX ---
            [
                'reference' => 'CMR-280064',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['immeuble-bureau']->id ?? 4,
                'transaction_type' => 'sale',
                'title' => 'Immeuble de Rapport R+3 • 8 Appartements Entièrement Loués (Akwa Centre)',
                'description' => "Actif patrimonial à fort rendement locatif situé en plein centre commercial d'Akwa à Douala. Monopropriété R+3 comprenant 8 appartements et 2 boutiques. Loyers annuels : 25 760 000 FCFA.",
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
                'reference' => 'CMR-420077',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['immeuble-bureau']->id ?? 4,
                'transaction_type' => 'sale',
                'title' => 'Résidence Meublée Haut Standing • 10 Suites à Bastos Yaoundé',
                'description' => "Immeuble moderne dédié à l'hébergement hôtelier et résidentiel d'expatriés. Revenus annuels bruts de 47 000 000 FCFA. Forage industriel silencieux, groupe 60 kVA, wifi fibre optique.",
                'price' => 420000000,
                'city' => 'Yaoundé',
                'neighborhood' => 'Bastos',
                'address' => 'Route Diplomatique',
                'built_area' => 540,
                'land_area' => 700,
                'rooms' => 22,
                'bedrooms' => 10,
                'bathrooms' => 10,
                'year_built' => 2021,
                'land_status' => 'title_available',
                'land_title_number' => '15110/Mfoundi',
                'is_exclusive' => true,
                'is_featured' => true,
                'amenities' => ['forage', 'groupe-electrogene', 'camwater', 'eneo', 'cloture-securisee', 'voie-bitumee', 'climatisation'],
            ],
            [
                'reference' => 'CMR-175088',
                'user_id' => $agentCroisette->id,
                'agency_id' => $agencyCroisette->id,
                'category_id' => $categories['immeuble-bureau']->id ?? 4,
                'transaction_type' => 'sale',
                'title' => 'Plateau de Bureaux Entièrement Aménagé 320 m² à Bonanjo',
                'description' => "Immeuble tertiaire de prestige avec contrôle d'accès biométrique, ascenseur, open-space modulable, salles de réunion climatisées et parking réservé.",
                'price' => 175000000,
                'city' => 'Douala',
                'neighborhood' => 'Bonanjo',
                'address' => 'Rue des Banques',
                'built_area' => 320,
                'land_area' => 320,
                'rooms' => 8,
                'bedrooms' => 0,
                'bathrooms' => 4,
                'year_built' => 2020,
                'land_status' => 'document_verified',
                'land_title_number' => 'TF 4500/Wouri',
                'is_exclusive' => false,
                'is_featured' => false,
                'amenities' => ['groupe-electrogene', 'climatisation', 'cloture-securisee', 'voie-bitumee'],
            ],

            // --- COMMERCE & LOCAL ---
            [
                'reference' => 'CMR-090035',
                'user_id' => $agentUser->id,
                'agency_id' => $agencyLetch->id,
                'category_id' => $categories['commerce-local']->id ?? 5,
                'transaction_type' => 'rent',
                'title' => 'Local Commercial Vitrine 180 m² sur Axe Principal Akwa',
                'description' => "Emplacement stratégique numéro 1 avec fort passage piéton et véhiculaire. Idéal pour agence bancaire, showroom de prestige, franchise internationale ou supermarché.",
                'price' => 2500000,
                'city' => 'Douala',
                'neighborhood' => 'Akwa',
                'address' => 'Boulevard Ahmadou Ahidjo',
                'built_area' => 180,
                'land_area' => 180,
                'rooms' => 4,
                'bedrooms' => 0,
                'bathrooms' => 2,
                'year_built' => 2018,
                'land_status' => 'title_available',
                'land_title_number' => 'TF 2300/Wouri',
                'is_exclusive' => true,
                'is_featured' => false,
                'amenities' => ['groupe-electrogene', 'camwater', 'eneo', 'voie-bitumee', 'climatisation'],
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

            // Générer 3 visuels WebP si pas de photos
            if ($property->images()->count() === 0) {
                $theme = $colorThemes[$index % count($colorThemes)];
                for ($p = 0; $p < 3; $p++) {
                    $img = $manager->create(1200, 800)->fill(sprintf('rgb(%d,%d,%d)', $theme['bg'][0], $theme['bg'][1], $theme['bg'][2]));

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

        $this->command->info(sprintf('%d biens de démonstration générés avec succès !', count($propertiesData)));
    }
}
