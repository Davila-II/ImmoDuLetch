import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '../constants/heroSlides';
import { useCarousel } from '../hooks/useCarousel';

export default function HeroBannerCarousel() {
  const { index, next, prev, goTo, playing, userPaused, togglePause, setHovered } = useCarousel(HERO_SLIDES.length);
  const slide = HERO_SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Catégories d'annonces"
      className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl group border border-slate-700/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Images : fondu entre deux slides (sans animation si l'utilisateur l'a demandé) */}
      {HERO_SLIDES.map((item, position) => (
        <div
          key={item.id}
          aria-hidden={position !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            position === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={item.image}
            alt=""
            loading={position === 0 ? 'eager' : 'lazy'}
            fetchPriority={position === 0 ? 'high' : 'auto'}
            className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0A1931]/95 via-[#0A1931]/75 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A1931] via-transparent to-black/30" />
        </div>
      ))}

      {/* Texte du slide affiché */}
      <div
        aria-live={playing ? 'off' : 'polite'}
        className="relative z-20 h-full max-w-4xl px-6 sm:px-12 flex flex-col justify-center space-y-4"
      >
        <span className="self-start inline-flex items-center gap-1.5 bg-[#F5A623] text-slate-950 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          {slide.tag}
        </span>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            {slide.title}
          </h2>
          <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#F5A623] tracking-wide drop-shadow-sm">
            {slide.highlight}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">{slide.subtext}</p>

        <div className="pt-2">
          <Link
            to={slide.ctaLink}
            className="inline-flex items-center gap-2.5 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/30 transition hover:-translate-y-0.5"
          >
            <span>{slide.ctaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Flèches : toujours visibles sur écran tactile, au survol sur ordinateur */}
      <button
        type="button"
        onClick={prev}
        aria-label="Slide précédent"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide suivant"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pause et indicateurs */}
      <div className="absolute bottom-5 right-6 sm:right-12 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={userPaused}
          aria-label={userPaused ? 'Reprendre le défilement' : 'Mettre le défilement en pause'}
          className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition"
        >
          {userPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((item, position) => (
            <button
              type="button"
              key={item.id}
              onClick={() => goTo(position)}
              aria-label={`Aller à : ${item.title}`}
              aria-current={position === index}
              className={`transition-all duration-300 rounded-full ${
                position === index ? 'w-8 h-2 bg-[#F5A623]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}