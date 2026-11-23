import React from 'react';
import { Home, Building2, MapPin, Building, Store } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Villa / Duplex', desc: 'Haut standing, Résidence', icon: Home },
  { id: 2, name: 'Appartement / Studio', desc: 'Meublé ou non meublé', icon: Building },
  { id: 3, name: 'Terrain Titré / Parcelle', desc: 'Titre Foncier net vendeur', icon: MapPin },
  { id: 4, name: 'Immeuble / Bureau', desc: 'Rapport locatif, Bureaux', icon: Building2 },
];

export default function Step1Operation({ formData, onChange, onNext, isSaving }) {
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
          placeholder="Ex : Duplex d'Exception avec Forage &amp; Piscine à Bastos"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full p-3 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#0A1931] focus:bg-white transition"
        />
      </div>

      {/* Type d'opération (À Vendre / À Louer) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Type d'opération transactionnelle <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange('transaction_type', 'sale')}
            className={`p-4 rounded-xl border text-center font-bold text-sm transition flex flex-col items-center justify-center gap-1 ${
              formData.transaction_type === 'sale'
                ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-md'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>À Vendre</span>
            <span className="text-[11px] font-normal opacity-80">(Cession de propriété certifiée)</span>
          </button>

          <button
            type="button"
            onClick={() => onChange('transaction_type', 'rent')}
            className={`p-4 rounded-xl border text-center font-bold text-sm transition flex flex-col items-center justify-center gap-1 ${
              formData.transaction_type === 'rent'
                ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-md'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>À Louer</span>
            <span className="text-[11px] font-normal opacity-80">(Bail résidentiel ou commercial)</span>
          </button>
        </div>
      </div>

      {/* Catégories avec Cards (comme screen (5).png) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Catégorie d'actif immobilier <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
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
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#0A1931] text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                  <div className="text-[10px] text-slate-500">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Localisation & Adresse */}
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
            <option value="Douala">Douala (Littoral)</option>
            <option value="Yaoundé">Yaoundé (Centre)</option>
            <option value="Kribi">Kribi (Océan)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Quartier de situation
          </label>
          <input
            type="text"
            placeholder="Ex : Bastos (Ambassades) ou Bonapriso"
            value={formData.neighborhood}
            onChange={(e) => onChange('neighborhood', e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Adresse physique / Repère cadastral
          </label>
          <input
            type="text"
            placeholder="Ex : Rue Joseph Mballa, Face Résidence Ambassade"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.title || isSaving}
          className="bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-sm disabled:opacity-50"
        >
          <span>{isSaving ? 'Enregistrement...' : 'Continuer vers Caractéristiques'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
