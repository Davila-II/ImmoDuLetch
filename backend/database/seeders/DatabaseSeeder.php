<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Données nécessaires au fonctionnement du site : toujours chargées
        $this->call([
            CategorySeeder::class,
            AmenitySeeder::class,
        ]);

        // Données fictives (faux biens, comptes avec mot de passe connu) :
        // uniquement en développement. Sur un serveur en production, APP_ENV vaut « production »,
        // donc `php artisan db:seed` ne les crée jamais.
        if (app()->environment('local')) {
            $this->call(DemoPropertySeeder::class);
        }
    }
}