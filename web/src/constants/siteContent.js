import { Building, Home, LandPlot, Store } from 'lucide-react';

// TEXTES PROMOTIONNELS : à faire valider par le client avant la mise en ligne.
// Aucune affirmation (certification, audit, chiffre de performance) ne doit figurer ici
// tant qu'elle n'est pas vraie et prouvable.

export const TOP_BANNER = {
  highlight: 'Plateforme immobilière au Cameroun',
  points: ['Statut foncier déclaré sur chaque annonce', 'Contact direct avec les propriétaires et les agences'],
  cities: 'Douala • Yaoundé • Kribi',
};

export const HERO = {
  badge: 'Immobilier à Douala, Yaoundé et Kribi',
  titleStart: 'Trouvez le bien idéal',
  titleHighlight: 'près de chez vous',
  subtitle:
    'Villas, appartements, terrains, immeubles et locaux commerciaux : contactez directement les propriétaires et les agences.',
};

export const PROPERTY_TYPES_SECTION = {
  eyebrow: 'Catégories',
  title: 'Explorer par type de bien',
  linkLabel: 'Voir toutes les annonces',
};

export const PROPERTY_TYPE_CARDS = [
  {
    slug: 'villa-duplex',
    icon: Home,
    title: 'Villas & duplex',
    text: 'Maisons et résidences, avec ou sans piscine, dans les quartiers résidentiels des grandes villes.',
  },
  {
    slug: 'terrain-titre',
    icon: LandPlot,
    title: 'Terrains & parcelles',
    text: 'Terrains à bâtir et lots, avec le statut foncier déclaré par le vendeur.',
  },
  {
    slug: 'immeuble-bureau',
    icon: Building,
    title: 'Immeubles & bureaux',
    text: 'Immeubles de rapport, studios meublés et bureaux pour investisseurs et entreprises.',
  },
  {
    slug: 'commerce-local',
    icon: Store,
    title: 'Commerces & locaux',
    text: 'Boutiques, locaux et entrepôts sur les axes commerçants.',
  },
];

export const RECENT_SECTION = {
  eyebrow: 'Nouveautés',
  title: 'Dernières annonces',
};

export const ESTIMATION = {
  badge: 'Propriétaires & vendeurs',
  title: 'Vendez ou faites estimer votre bien',
  text: 'Décrivez votre bien : notre équipe vous recontacte pour en discuter, sans engagement.',
  steps: ['Vous décrivez votre bien', 'Notre équipe vous recontacte', 'Vous décidez, sans engagement'],
  formTitle: "Demande d'estimation",
  formSubtitle: 'Sans engagement',
};

export const ESTIMATION_ASSET_TYPES = [
  { value: 'Villa / Duplex', label: 'Villa / Duplex' },
  { value: 'Terrain titré', label: 'Terrain titré' },
  { value: 'Appartement', label: 'Appartement' },
  { value: 'Immeuble', label: 'Immeuble' },
  { value: 'Commerce / Entrepôt', label: 'Commerce / Entrepôt' },
];