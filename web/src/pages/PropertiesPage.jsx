import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import FilterPanel from '../components/properties/FilterPanel';
import PropertyResults from '../components/properties/PropertyResults';
import { readFilters, toSearchParams } from '../utils/propertyFilters';

const SORT_OPTIONS = [
  { value: 'newest', label: "Nouveautés d'abord" },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
];

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Les filtres vivent dans l'adresse : pas d'état à synchroniser, le retour arrière fonctionne
  const filters = readFilters(searchParams);
  const query = toSearchParams(filters).toString();

  const applyFilters = (next) => setSearchParams(toSearchParams(next));
  const resetFilters = () => setSearchParams({});

  // Calcul du nombre de filtres actifs (hors tri)
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'sort' && Boolean(value)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* En-tête : Titre, bouton filtres mobile et sélecteur de tri */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1931]">Biens disponibles au Cameroun</h1>
          <p className="text-xs text-slate-500 mt-0.5">Annonces immobilières vérifiées et certifiées</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Bouton Filtres dédié pour Mobile & Tablette */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#0A1931] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sélecteur de Tri */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs font-semibold text-slate-600 whitespace-nowrap hidden xs:inline">
              Trier par :
            </label>
            <select
              id="sort"
              value={filters.sort || 'newest'}
              onChange={(event) => applyFilters({ ...filters, sort: event.target.value })}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 sm:px-3 py-2 font-medium focus:ring-2 focus:ring-[#0A1931] shadow-xs"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6 items-start">
        {/* Panneau de filtres : Aside sur grand écran, Drawer sur mobile */}
        <FilterPanel
          key={query}
          initial={filters}
          onApply={applyFilters}
          onReset={resetFilters}
          isOpenMobile={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        {/* Grille de résultats */}
        <div className="lg:col-span-3 w-full">
          <PropertyResults key={query} query={query} onReset={resetFilters} />
        </div>
      </div>
    </div>
  );
}
