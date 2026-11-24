// BANNIÈRE D'ACCUEIL. Les textes sont volontairement sobres : aucune affirmation
// (certification, rendement, garantie) tant qu'elle n'est pas vraie et prouvable.
// À faire valider ou remplacer par le client.
//
// IMAGES : fichiers dans web/public/hero/. Vérifier que chaque image correspond à son texte
// et que le droit de l'utiliser est établi (photos du client ou banque d'images libre de droits).
export const HERO_SLIDES = [
  {
    id: 'appartements',
    image: '/hero/slide-1.jpeg',
    tag: 'Appartements & studios',
    title: 'Trouvez votre logement au Cameroun',
    highlight: 'À louer ou à acheter',
    subtext: 'Douala • Yaoundé • Kribi',
    ctaText: 'Voir les appartements',
    ctaLink: '/properties?category=appartement-studio',
  },
  {
    id: 'terrains',
    image: '/hero/slide-2.jpeg',
    tag: 'Terrains & parcelles',
    title: 'Terrains et parcelles',
    highlight: 'À bâtir ou à investir',
    subtext: 'Le statut foncier est déclaré sur chaque annonce',
    ctaText: 'Voir les terrains',
    ctaLink: '/properties?category=terrain-titre',
  },
  {
    id: 'villas',
    image: '/hero/slide-3.jpeg',
    tag: 'Villas & résidences',
    title: 'Villas et résidences',
    highlight: 'Dans les quartiers résidentiels',
    subtext: 'Filtrez par ville, budget, chambres et équipements',
    ctaText: 'Explorer les villas',
    ctaLink: '/properties?category=villa-duplex',
  },
  {
    id: 'immeubles',
    image: '/hero/slide-4.jpeg',
    tag: 'Immeubles & bureaux',
    title: 'Immeubles et bureaux',
    highlight: 'Pour investisseurs et entreprises',
    subtext: 'Immeubles de rapport, bureaux et locaux',
    ctaText: 'Voir les immeubles',
    ctaLink: '/properties?category=immeuble-bureau',
  },
];