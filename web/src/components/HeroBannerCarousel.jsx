import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    image: '/hero/slide-1.jpeg',
    tag: 'GUIDE & EXPERTISE 2026',
    title: 'Trouver le Logement Idéal au Cameroun',
    highlight: '5 ÉTAPES CLÉS',
    badge: '100% SÉCURISÉ',
    ctaText: 'Découvrir le guide',
    ctaLink: '/properties?category=appartement-studio',
    subtext: 'Bastos • Bonapriso • Kribi — Titres fonciers vérifiés',
  },
  {
    id: 2,
    image: '/hero/slide-2.jpeg',
    tag: 'SIGNATURE ARCHITECTURALE',
    title: 'Terrains Titrés & Bornés Pieds dans l’Eau',
    highlight: 'CONFORT & PRESTIGE',
    badge: 'EXCLUSIVITÉ LETCH',
    ctaText: 'Explorer les résidences',
    ctaLink: '/properties?category=villa-duplex',
    subtext: 'Piscines privatives, forages autonomes & groupes 25kVA',
  },
  {
    id: 3,
    image: '/hero/slide-3.jpeg',
    tag: 'OPPORTUNITÉ FONCIÈRE',
    title: 'Résidences Haut Standing & Penthouses',
    highlight: 'ACCÈS DIRECT PLAGE',
    badge: 'LIVRE FONCIER OK',
    ctaText: 'Voir les parcelles',
    ctaLink: '/properties?category=terrain-titre',
    subtext: 'Kribi & Yassa — Bornage contradictoire certifié',
  },
  {
    id: 4,
    image: '/hero/slide-4.jpeg',
    tag: 'INVESTISSEMENT PATRIMONIAL',
    title: 'Immeubles de Rapport & Rendement Locatif',
    highlight: 'JUSQU’À 12% BRUT',
    badge: '100% LOUÉ',
    ctaText: 'Calculer la rentabilité',
    ctaLink: '/properties?category=immeuble-bureau',
    subtext: 'Akwa & Bonanjo — Monopropriétés à fort cash-flow',
  },
];

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play rotatif toutes les 5 secondes
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[current];

  return (
    <div 
      className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl group border border-slate-700/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel avec fondu et zoom subtil */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1931]/95 via-[#0A1931]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931] via-transparent to-black/30" />
        </div>
      ))}

      {/* Contenu textuel interactif au-dessus (Style mobile.de Punchy) */}
      <div className="relative z-20 h-full max-w-4xl px-6 sm:px-12 flex flex-col justify-center space-y-4">
        {/* Tag & Badge flottants */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 bg-[#F5A623] text-slate-950 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            {slide.tag}
          </span>
          <span className="bg-white/15 backdrop-blur-md text-amber-300 border border-amber-300/30 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            {slide.badge}
          </span>
        </div>

        {/* Titre Principal percutant */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            {slide.title}
          </h2>
          <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#F5A623] tracking-wide drop-shadow-sm">
            {slide.highlight}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          {slide.subtext}
        </p>

        {/* Bouton d'action (CTA) */}
        <div className="pt-2 flex items-center gap-4">
          <Link
            to={slide.ctaLink}
            className="inline-flex items-center gap-2.5 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5"
          >
            <span>{slide.ctaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Garantie Notariale &amp; Cadastre
          </span>
        </div>
      </div>

      {/* Flèches de navigation gauche / droite */}
      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicateurs de progression (Dots) en bas */}
      <div className="absolute bottom-5 right-6 sm:right-12 z-30 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? 'w-8 h-2 bg-[#F5A623]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Aller au slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
