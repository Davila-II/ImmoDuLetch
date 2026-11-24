import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, MapPin, Search, Check, RefreshCw } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filtres d'état local initialisés directement depuis les searchParams
  const [filters, setFilters] = useState({
    transaction_type: searchParams.get('transaction_type') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    q: searchParams.get('q') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_bedrooms: searchParams.get('min_bedrooms') || '',
    land_status: searchParams.get('land_status') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  // Fonction de chargement qui accepte les filtres en argument pour éviter les closures désynchronisées
  const fetchProperties = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data?.data || []);
      setTotal(response.data?.total ?? (response.data?.data ? response.data.data.length : 0));
    } catch (err) {
      console.error('Erreur listing biens', err);
    } finally {
      setLoading(false);
    }
  };

  // Synchronisation stricte quand l'URL change (ex: clic sur une catégorie ou retour arrière)
  useEffect(() => {
    const updated = {
      transaction_type: searchParams.get('transaction_type') || '',
      category: searchParams.get('category') || '',
      city: searchParams.get('city') || '',
      q: searchParams.get('q') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      min_bedrooms: searchParams.get('min_bedrooms') || '',
      land_status: searchParams.get('land_status') || '',
      sort: searchParams.get('sort') || 'newest',
    };
    setFilters(updated);
    fetchProperties(updated);
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    const updated = { ...filters, sort: newSort };
    setFilters(updated);
    const params = new URLSearchParams(searchParams);
    if (newSort) params.set('sort', newSort);
    else params.delete('sort');
    setSearchParams(params);
  };

  const resetFilters = () => {
    const cleared = {
      transaction_type: '',
      category: '',
      city: '',
      q: '',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      land_status: '',
      sort: 'newest',
    };
    setFilters(cleared);
    setSearchParams({});
    fetchProperties(cleared);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête / Résultats & Tri (comme screen (16).png & standard mobile.de) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0A1931]">
            Biens disponibles au Cameroun
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {total} annonces immobilières vérifiées et audités
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Trier par :</label>
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-[#0A1931]"
          >
            <option value="newest">Nouveautés d'abord</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Grid 2 Colonnes : Panneau Filtres latéraux (Gauche) + Résultats (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* FILTRES LATÉRAUX (Style mobile.de faceted search) */}
        <aside className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500" />
              Filtres détaillés
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Effacer
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-4 text-xs">
            {/* Type de transaction */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Opération</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, transaction_type: filters.transaction_type === 'sale' ? '' : 'sale' })}
                  className={`py-2 px-3 rounded-lg border font-medium text-center transition ${
                    filters.transaction_type === 'sale'
                      ? 'bg-[#0A1931] text-white border-[#0A1931]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Acheter
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, transaction_type: filters.transaction_type === 'rent' ? '' : 'rent' })}
                  className={`py-2 px-3 rounded-lg border font-medium text-center transition ${
                    filters.transaction_type === 'rent'
                      ? 'bg-[#0A1931] text-white border-[#0A1931]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Louer
                </button>
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Ville</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                <option value="">Toutes les localités</option>
                <option value="Douala">Douala (Bonapriso, Bonanjo, Akwa...)</option>
                <option value="Yaoundé">Yaoundé (Bastos, Golf...)</option>
                <option value="Kribi">Kribi (Zone Balnéaire)</option>
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Typologie d'actif</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                <option value="">Tous les types</option>
                <option value="villa-duplex">Villa &amp; Duplex</option>
                <option value="appartement-studio">Appartement &amp; Studio</option>
                <option value="terrain-titre">Terrain titré &amp; Parcelle</option>
                <option value="immeuble-bureau">Immeuble &amp; Bureau</option>
                <option value="commerce-local">Commerce &amp; Local</option>
              </select>
            </div>

            {/* Prix Min / Max */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Budget (FCFA)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            {/* Chambres minimum */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Chambres minimum</label>
              <div className="flex gap-1.5">
                {['', '1', '2', '3', '4+'].map((nb) => (
                  <button
                    key={nb || 'all'}
                    type="button"
                    onClick={() => setFilters({ ...filters, min_bedrooms: nb === '4+' ? '4' : nb })}
                    className={`flex-1 py-1.5 rounded border text-center font-medium ${
                      (filters.min_bedrooms === nb || (nb === '4+' && filters.min_bedrooms === '4'))
                        ? 'bg-[#0A1931] text-white border-[#0A1931]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {nb || 'Tous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut foncier */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Statut Foncier Certifié</label>
              <select
                value={filters.land_status}
                onChange={(e) => setFilters({ ...filters, land_status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                <option value="">Tous les statuts</option>
                <option value="titre_disponible">Titre foncier disponible</option>
                <option value="verifie_professionnel">Vérifié par professionnel</option>
                <option value="en_cours">Procédure en cours</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-xs"
            >
              Appliquer les filtres
            </button>
          </form>
        </aside>

        {/* LISTE DES RÉSULTATS (Droite) */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.reference} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Aucun bien ne correspond à ces critères</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Modifiez vos filtres de recherche ou réinitialisez-les pour découvrir toutes nos offres certifiées.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#0A1931] text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
