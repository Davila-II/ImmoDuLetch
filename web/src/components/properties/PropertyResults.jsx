import { Search } from 'lucide-react';
import Alert from '../ui/Alert';
import PropertyCard from '../PropertyCard';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';

const SKELETONS = [1, 2, 3, 4, 5, 6];

// Le parent recrée ce composant (« key ») quand les filtres changent : l'état repart proprement
export default function PropertyResults({ query, onReset }) {
  const path = query ? `/properties?${query}` : '/properties';
  const { items, total, loading, loadingMore, error, hasMore, loadMore, reload } = usePaginatedResource(path);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETONS.map((n) => (
          <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <Alert className="flex items-center justify-between gap-3">
        <span>{error}</span>
        <button type="button" onClick={reload} className="font-bold underline shrink-0">
          Réessayer
        </button>
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
        <Search className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-800 text-base">Aucune annonce ne correspond à ces critères</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Modifiez vos filtres ou réinitialisez la recherche pour voir toutes les annonces.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="bg-[#0A1931] text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition"
        >
          Réinitialiser la recherche
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        {total} annonce{total > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((property) => (
          <PropertyCard key={property.reference} property={property} />
        ))}
      </div>

      {error && <Alert>{error}</Alert>}

      {hasMore && (
        <div className="text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-lg text-xs disabled:opacity-50"
          >
            {loadingMore ? 'Chargement…' : "Voir plus d'annonces"}
          </button>
        </div>
      )}
    </div>
  );
}