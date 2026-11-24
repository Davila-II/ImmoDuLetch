import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROPERTY_TYPE_CARDS, PROPERTY_TYPES_SECTION } from '../../constants/siteContent';

export default function PropertyTypes() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{PROPERTY_TYPES_SECTION.eyebrow}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{PROPERTY_TYPES_SECTION.title}</h2>
        </div>
        <Link to="/properties" className="text-sm font-semibold text-[#0A1931] hover:text-amber-600 flex items-center gap-1">
          <span>{PROPERTY_TYPES_SECTION.linkLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROPERTY_TYPE_CARDS.map(({ slug, icon: Icon, title, text }) => (
          <Link
            key={slug}
            to={`/properties?category=${slug}`}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group"
          >
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-[#0A1931] group-hover:text-amber-400 transition">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{text}</p>
            <div className="text-xs font-bold text-[#0A1931] flex items-center gap-1">
              <span>Voir les annonces</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}