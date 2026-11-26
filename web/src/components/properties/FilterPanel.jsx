import { useState } from 'react';
import { Filter, RefreshCw, X } from 'lucide-react';
import SelectField from '../ui/SelectField';
import { CITY_OPTIONS } from '../../constants/cities';
import { LAND_STATUS_LABELS } from '../../constants/landStatus';
import { useCatalog } from '../../hooks/useCatalog';
import { useLanguage } from '../../context/LanguageContext';

const LAND_STATUS_OPTIONS = Object.entries(LAND_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const onlyDigits = (value) => value.replace(/\D/g, '');
const fieldClass = 'w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-2 text-xs';

export default function FilterPanel({ initial, onApply, onReset, isOpenMobile = false, onCloseMobile }) {
  const { categories } = useCatalog();
  const { t } = useLanguage();
  const [draft, setDraft] = useState(initial);

  const transactions = [
    { value: 'sale', label: t('hero.buyTab') },
    { value: 'rent', label: t('hero.rentTab') },
  ];

  const bedroomChoices = [
    { value: '', label: t('catalog.allBedrooms') },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' },
  ];

  const setField = (field) => (event) => setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  const setDigits = (field) => (event) => setDraft((prev) => ({ ...prev, [field]: onlyDigits(event.target.value) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
    if (onCloseMobile) onCloseMobile();
  };

  const handleReset = () => {
    onReset();
    if (onCloseMobile) onCloseMobile();
  };

  const panelContent = (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-500" />
          {t('catalog.filtersTitle')}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            {t('catalog.clear')}
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md"
              aria-label="Fermer les filtres"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <span className="font-semibold text-slate-700 block mb-1.5">{t('catalog.operation')}</span>
          <div className="grid grid-cols-2 gap-2">
            {transactions.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  setDraft((prev) => ({ ...prev, transaction_type: prev.transaction_type === value ? '' : value }))
                }
                className={`py-2.5 sm:py-2 px-3 rounded-lg border font-medium text-center transition ${
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
          label={t('catalog.city')}
          placeholder={t('hero.allCities')}
          options={CITY_OPTIONS}
          value={draft.city}
          onChange={setField('city')}
        />

        <SelectField
          id="filter-category"
          label={t('hero.propertyType')}
          placeholder={t('hero.allTypes')}
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
          <span className="font-semibold text-slate-700 block mb-1.5">{t('catalog.bedroomsMin')}</span>
          <div className="flex gap-1.5">
            {bedroomChoices.map(({ value, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, min_bedrooms: value }))}
                className={`flex-1 py-2 sm:py-1.5 rounded border text-center font-medium ${
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
          label={t('catalog.landStatus')}
          placeholder={t('catalog.allStatuses')}
          options={LAND_STATUS_OPTIONS}
          value={draft.land_status}
          onChange={setField('land_status')}
        />

        <button
          type="submit"
          className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 sm:py-2.5 rounded-xl sm:rounded-lg text-xs transition shadow-xs"
        >
          {t('catalog.applyFilters')}
        </button>
      </form>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:col-span-1 h-fit sticky top-24">
        {panelContent}
      </aside>

      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg max-h-[85vh] sm:rounded-2xl rounded-t-2xl overflow-y-auto p-4 sm:p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {panelContent}
          </div>
        </div>
      )}
    </>
  );
}
