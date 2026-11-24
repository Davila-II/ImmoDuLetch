import { Home, Building, MapPin, Building2, Store, Package } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

// Icône et sous-titre de chaque catégorie, d'après son identifiant (slug) côté serveur
const CATEGORY_UI = {
  'villa-duplex': { icon: Home, desc: 'Haut standing, résidence' },
  'appartement-studio': { icon: Building, desc: 'Meublé ou non meublé' },
  'terrain-titre': { icon: MapPin, desc: 'Terrain ou parcelle' },
  'immeuble-bureau': { icon: Building2, desc: 'Rapport locatif, bureaux' },
  'commerce-local': { icon: Store, desc: 'Boutiques et locaux commerciaux' },
};
const FALLBACK_UI = { icon: Package, desc: '' };

export default function Step1Operation({ formData, onChange, onNext, isSaving, missing = [] }) {
  const { categories, isLoading, error } = useCatalog();
  const canContinue = missing.length === 0 && !isSaving;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Paramétrage Foncier</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Nature du Mandat &amp; Typologie</h2>
        <p className="text-xs text-slate-500 mt-1">Définissez le type de transaction et la typologie exacte de votre actif.</p>
      </div>

      {/* Titre de l'annonce */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Titre de présentation de l'annonce <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          maxLength={255}
          placeholder="Ex : Duplex d'Exception avec Forage &amp; Piscine à Bastos"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full p-3 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#0A1931] focus:bg-white transition"
        />
      </div>

      {/* Type d'opération */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Type d'opération transactionnelle <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'sale', label: 'À Vendre', hint: '(Cession de propriété)' },
            { id: 'rent', label: 'À Louer', hint: '(Bail résidentiel ou commercial)' },
          ].map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => onChange('transaction_type', option.id)}
              className={`p-4 rounded-xl border text-center font-bold text-sm transition flex flex-col items-center justify-center gap-1 ${
                formData.transaction_type === option.id
                  ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-md'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{option.label}</span>
              <span className="text-[11px] font-normal opacity-80">{option.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Catégories, chargées depuis l'API */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Catégorie d'actif immobilier <span className="text-rose-500">*</span>
        </label>

        {isLoading && <p className="text-xs text-slate-400">Chargement des catégories…</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const ui = CATEGORY_UI[cat.slug] || FALLBACK_UI;
            const Icon = ui.icon;
            const isSelected = formData.category_id === cat.id;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onChange('category_id', cat.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-32 relative ${
                  isSelected
                    ? 'border-[#F5A623] bg-amber-50/50 shadow-sm ring-2 ring-[#F5A623]/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#0A1931] text-amber-400' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                  <div className="text-[10px] text-slate-500">{ui.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Localisation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Ville principale <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium"
          >
            <option value="">Sélectionner une ville</option>
            <option value="Douala">Douala (Littoral)</option>
            <option value="Yaoundé">Yaoundé (Centre)</option>
            <option value="Kribi">Kribi (Sud)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Quartier de situation <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            maxLength={100}
            placeholder="Ex : Bastos (Ambassades) ou Bonapriso"
            value={formData.neighborhood}
            onChange={(e) => onChange('neighborhood', e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Adresse physique / repère
          </label>
          <input
            type="text"
            maxLength={255}
            placeholder="Ex : Rue Joseph Mballa, face Résidence Ambassade"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            L'adresse exacte n'est visible que par vous et par l'équipe de modération.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          {missing.length > 0 ? `À renseigner : ${missing.map((item) => item.label).join(', ')}` : ''}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <span>{isSaving ? 'Enregistrement...' : 'Continuer vers Caractéristiques'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}