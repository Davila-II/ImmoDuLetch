import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Home, Key, MapPin, Search } from 'lucide-react';
import SelectField from '../ui/SelectField';
import { getBudgetOptions } from '../../constants/budgets';
import { CITY_OPTIONS } from '../../constants/cities';
import { useCatalog } from '../../hooks/useCatalog';
import { useLanguage } from '../../context/LanguageContext';

export default function SearchBox() {
  const navigate = useNavigate();
  const { categories } = useCatalog();
  const { t } = useLanguage();
  const [form, setForm] = useState({ transaction_type: 'sale', city: '', category: '', max_price: '' });

  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  // Changer de mode remet le budget à zéro
  const changeTransaction = (type) => setForm((prev) => ({ ...prev, transaction_type: type, max_price: '' }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/properties?${params.toString()}`);
  };

  const isSale = form.transaction_type === 'sale';

  const transactions = [
    { id: 'sale', label: t('hero.buyTab'), icon: Key },
    { id: 'rent', label: t('hero.rentTab'), icon: Home },
  ];

  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 text-slate-800 shadow-2xl border border-slate-100 max-w-4xl mx-auto text-left">
      <div className="flex border-b border-slate-200 pb-3 mb-4 gap-2">
        {transactions.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => changeTransaction(id)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              form.transaction_type === id ? 'bg-[#0A1931] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4 text-amber-400" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SelectField
          id="home-city"
          label={t('hero.location')}
          icon={MapPin}
          placeholder={t('hero.allCities')}
          options={CITY_OPTIONS}
          value={form.city}
          onChange={setField('city')}
        />

        <SelectField
          id="home-category"
          label={t('hero.propertyType')}
          icon={Building}
          placeholder={t('hero.allTypes')}
          options={categories.map((category) => ({ value: category.slug, label: category.name }))}
          value={form.category}
          onChange={setField('category')}
        />

        <SelectField
          id="home-budget"
          label={isSale ? t('hero.budgetMaxSale') : t('hero.budgetMaxRent')}
          placeholder={t('hero.anyBudget')}
          options={getBudgetOptions(form.transaction_type)}
          value={form.max_price}
          onChange={setField('max_price')}
        />

        <div className="flex items-end pt-1 sm:pt-0">
          <button
            type="submit"
            className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 sm:py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>{t('hero.searchButton')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
