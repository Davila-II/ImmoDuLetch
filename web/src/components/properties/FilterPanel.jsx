import { useState } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import SelectField from '../ui/SelectField';
import { CITY_OPTIONS } from '../../constants/cities';
import { LAND_STATUS_LABELS } from '../../constants/landStatus';
import { useCatalog } from '../../hooks/useCatalog';

const TRANSACTIONS = [
  { value: 'sale', label: 'Acheter' },
  { value: 'rent', label: 'Louer' },
];
const BEDROOM_CHOICES = [
  { value: '', label: 'Tous' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
];
const LAND_STATUS_OPTIONS = Object.entries(LAND_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const onlyDigits = (value) => value.replace(/\D/g, '');
const fieldClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs';

// Le brouillon des filtres reste local jusqu'à « Appliquer ». Le parent recrée ce composant (« key »)
// quand l'adresse change, ce qui remet les champs à jour (retour arrière, clic sur une catégorie…).
export default function FilterPanel({ initial, onApply, onReset }) {
  const { categories } = useCatalog();
  const [draft, setDraft] = useState(initial);

  const setField = (field) => (event) => setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  const setDigits = (field) => (event) => setDraft((prev) => ({ ...prev, [field]: onlyDigits(event.target.value) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  return (
    <aside className="lg:col-span-1 bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          Filtres
        </span>
        <button type="button" onClick={onReset} className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Effacer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <span className="font-semibold text-slate-700 block mb-1.5">Opération</span>
          <div className="grid grid-cols-2 gap-2">
            {TRANSACTIONS.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  setDraft((prev) => ({ ...prev, transaction_type: prev.transaction_type === value ? '' : value }))
                }
                className={`py-2 px-3 rounded-lg border font-medium text-center transition ${
                  draft.transaction_type === value
                    ? 'bg-[#0A1931] text-white border-[#0A1931]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <SelectField
          id="filter-city"
          label="Ville"
          placeholder="Toutes les villes"
          options={CITY_OPTIONS}
          value={draft.city}
          onChange={setField('city')}
        />

        <SelectField
          id="filter-category"
          label="Type de bien"
          placeholder="Tous les types"
          options={categories.map((category) => ({ value: category.slug, label: category.name }))}
          value={draft.category}
          onChange={setField('category')}
        />

        <div>
          <span className="font-semibold text-slate-700 block mb-1.5">Budget (FCFA)</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              aria-label="Budget minimum"
              placeholder="Min"
              value={draft.min_price}
              onChange={setDigits('min_price')}
              className={fieldClass}
            />
            <input
              type="text"
              inputMode="numeric"
              aria-label="Budget maximum"
              placeholder="Max"
              value={draft.max_price}
              onChange={setDigits('max_price')}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <span className="font-semibold text-slate-700 block mb-1.5">Chambres minimum</span>
          <div className="flex gap-1.5">
            {BEDROOM_CHOICES.map(({ value, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, min_bedrooms: value }))}
                className={`flex-1 py-1.5 rounded border text-center font-medium ${
                  draft.min_bedrooms === value
                    ? 'bg-[#0A1931] text-white border-[#0A1931]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <SelectField
          id="filter-land-status"
          label="Statut foncier (déclaré)"
          placeholder="Tous les statuts"
          options={LAND_STATUS_OPTIONS}
          value={draft.land_status}
          onChange={setField('land_status')}
        />

        <button
          type="submit"
          className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-xs"
        >
          Appliquer les filtres
        </button>
      </form>
    </aside>
  );
}