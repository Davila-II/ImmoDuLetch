import { Award } from 'lucide-react';
import { HERO } from '../../constants/siteContent';
import SearchBox from './SearchBox';

export default function HeroSearch() {
  return (
    <section className="relative bg-[#0A1931] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-xl">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-semibold backdrop-blur-md">
          <Award className="w-3.5 h-3.5" />
          <span>{HERO.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {HERO.titleStart} <span className="text-amber-400">{HERO.titleHighlight}</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">{HERO.subtitle}</p>

        <SearchBox />
      </div>
    </section>
  );
}