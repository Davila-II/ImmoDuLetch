import { useSearchParams } from 'react-router-dom';
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

  // Les filtres vivent dans l'adresse : pas d'état à synchroniser, le retour arrière fonctionne
  const filters = readFilters(searchParams);
  const query = toSearchParams(filters).toString();

  const applyFilters = (next) => setSearchParams(toSearchParams(next));
  const resetFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <h1 className="text-2xl font-extrabold text-[#0A1931]">Biens disponibles au Cameroun</h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="sort" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Trier par :
          </label>
          <select
            id="sort"
            value={filters.sort || 'newest'}
            onChange={(event) => applyFilters({ ...filters, sort: event.target.value })}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-[#0A1931]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        <FilterPanel key={query} initial={filters} onApply={applyFilters} onReset={resetFilters} />

        <div className="lg:col-span-3">
          <PropertyResults key={query} query={query} onReset={resetFilters} />
        </div>
      </div>
    </div>
  );
}