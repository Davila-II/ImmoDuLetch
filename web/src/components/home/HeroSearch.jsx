import { Award } from 'lucide-react';
import SearchBox from './SearchBox';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroSearch() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#0A1931] text-white pt-8 pb-14 sm:pt-10 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-xl">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
          <Award className="w-3.5 h-3.5 shrink-0" />
          <span>{t('hero.badge')}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t('hero.titleStart')} <span className="text-amber-400">{t('hero.titleHighlight')}</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal px-2">
          {t('hero.subtitle')}
        </p>

        <SearchBox />
      </div>
    </section>
  );
}
