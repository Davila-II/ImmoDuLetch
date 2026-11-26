import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import Alert from '../ui/Alert';
import PropertyCard from '../PropertyCard';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { useLanguage } from '../../context/LanguageContext';

export default function FavoritesList() {
  const { t } = useLanguage();
  const { items, total, loading, loadingMore, error, hasMore, loadMore, reload, removeWhere } =
    usePaginatedResource('/favorites');

  // Un bien retiré des favoris disparaît tout de suite de la liste
  const handleFavoriteChange = (reference, isFavorite) => {
    if (!isFavorite) removeWhere((property) => property.reference === reference);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-[#0A1931] flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-current" />
          <span>{t('favorites.title', null, 'Mes favoris')}{loading ? '' : ` (${total})`}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">{t('favorites.subtitle', null, 'Retrouvez les biens que vous avez enregistrés')}</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <Alert className="flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={reload} className="font-bold underline shrink-0">
            {t('catalog.clear', null, 'Réessayer')}
          </button>
        </Alert>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((property) => (
            <PropertyCard key={property.reference} property={property} onFavoriteToggle={handleFavoriteChange} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2 rounded-lg text-xs disabled:opacity-50"
          >
            {loadingMore ? 'Chargement…' : t('catalog.loadMore', null, 'Voir plus')}
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">{t('favorites.emptyTitle', null, 'Aucun favori pour le moment')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('favorites.emptyText', null, 'Parcourez les annonces et cliquez sur le cœur pour les retrouver ici.')}
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-[#0A1931] text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition"
          >
            <span>{t('favorites.discover', null, 'Découvrir les annonces')}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      )}
    </div>
  );
}