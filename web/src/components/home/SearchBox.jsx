import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Home, Key, MapPin, Search } from 'lucide-react';
import SelectField from '../ui/SelectField';
import { getBudgetOptions } from '../../constants/budgets';
import { CITY_OPTIONS } from '../../constants/cities';
import { useCatalog } from '../../hooks/useCatalog';

const TRANSACTIONS = [
  { id: 'sale', label: 'Acheter', icon: Key },
  { id: 'rent', label: 'Louer', icon: Home },
];

export default function SearchBox() {
  const navigate = useNavigate();
  const { categories } = useCatalog();
  const [form, setForm] = useState({ transaction_type: 'sale', city: '', category: '', max_price: '' });

  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  // Changer de mode remet le budget à zéro : les tranches ne sont pas les mêmes
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

  return (
    <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 text-slate-800 shadow-2xl border border-slate-100 max-w-4xl mx-auto text-left">
      <div className="flex border-b border-slate-200 pb-3 mb-4 gap-2">
        {TRANSACTIONS.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => changeTransaction(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
              form.transaction_type === id ? 'bg-[#0A1931] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4 text-amber-400" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField
          id="home-city"
          label="Localisation"
          icon={MapPin}
          placeholder="Toutes les villes"
          options={CITY_OPTIONS}
          value={form.city}
          onChange={setField('city')}
        />

        <SelectField
          id="home-category"
          label="Type de bien"
          icon={Building}
          placeholder="Tous les types"
          options={categories.map((category) => ({ value: category.slug, label: category.name }))}
          value={form.category}
          onChange={setField('category')}
        />

        <SelectField
          id="home-budget"
          label={isSale ? 'Budget max (FCFA)' : 'Loyer max / mois (FCFA)'}
          placeholder="Indifférent"
          options={getBudgetOptions(form.transaction_type)}
          value={form.max_price}
          onChange={setField('max_price')}
        />

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher</span>
          </button>
        </div>
      </form>
    </div>
  );
}