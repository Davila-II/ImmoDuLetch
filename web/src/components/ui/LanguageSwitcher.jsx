import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ variant = 'navbar' }) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'drawer') {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Globe className="w-4 h-4 text-amber-500" />
          <span>Langue / Language</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('fr')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
              language === 'fr' ? 'bg-[#0A1931] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
              language === 'en' ? 'bg-[#0A1931] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs"
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
      aria-label="Changer de langue"
    >
      <Globe className="w-3.5 h-3.5 text-amber-500" />
      <span>{language.toUpperCase()}</span>
    </button>
  );
}
