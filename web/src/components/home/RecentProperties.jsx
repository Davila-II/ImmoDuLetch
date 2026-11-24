import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Alert from '../ui/Alert';
import PropertyCard from '../PropertyCard';
import { RECENT_SECTION } from '../../constants/siteContent';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';

export default function RecentProperties() {
  const { items, total, loading, error, reload } = usePaginatedResource('/properties?per_page=6');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{RECENT_SECTION.eyebrow}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{RECENT_SECTION.title}</h2>
        </div>
        <Link to="/properties" className="text-xs sm:text-sm font-semibold text-[#0A1931] hover:text-amber-600 flex items-center gap-1">
          <span>Voir tout{total > 0 ? ` (${total})` : ''}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <Alert className="flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={reload} className="font-bold underline shrink-0">
            Réessayer
          </button>
        </Alert>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">Aucune annonce publiée pour le moment.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((property) => (
            <PropertyCard key={property.reference} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
