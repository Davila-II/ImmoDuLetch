import React from 'react';
import { TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Step4Pricing({ 
  formData, 
  onChange, 
  onPrev, 
  onSubmit, 
  isSubmitting 
}) {
  const price = parseInt(formData.price || 0, 10);
  const area = parseInt(formData.built_area || formData.land_area || 0, 10);
  const pricePerSqm = area > 0 ? Math.round(price / area) : 0;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ALGORITHME &amp; INDICE DE MARCHÉ</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Prix Net Vendeur &amp; Validation Finale</h2>
        <p className="text-slate-500 mt-1">Fixez votre prix en accord avec les références notariales du quartier.</p>
      </div>

      {/* Saisie du prix */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        <label className="block font-bold text-slate-800 uppercase tracking-wider text-xs">
          Prix Net Vendeur Souhaité (FCFA) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            required
            placeholder="Ex : 185000000"
            value={formData.price}
            onChange={(e) => onChange('price', e.target.value)}
            className="w-full text-2xl font-black text-[#0A1931] bg-white border border-slate-200 rounded-xl p-3.5 pr-20"
          />
          <span className="absolute right-4 top-4 font-bold text-slate-400 text-sm">FCFA</span>
        </div>

        {pricePerSqm > 0 && (
          <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
            <span>Valorisation calculée :</span>
            <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[#0A1931]">
              {new Intl.NumberFormat('fr-FR').format(pricePerSqm)} FCFA / m²
            </span>
          </div>
        )}
      </div>

      {/* Description du bien */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
          Description complète du bien
        </label>
        <textarea
          rows="5"
          placeholder="Détaillez les atouts majeurs (accès sécurisé, finitions haut de gamme, état du voisinage, commodités)..."
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
        ></textarea>
      </div>

      {/* Visite 3D (Optionnelle) */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Lien de Visite Virtuelle 3D (Optionnel)
        </label>
        <input
          type="url"
          placeholder="https://my.matterport.com/show/?m=..."
          value={formData.virtual_tour_url || ''}
          onChange={(e) => onChange('virtual_tour_url', e.target.value)}
          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
        />
      </div>

      {/* Bloc Indice de positionnement du quartier (comme screen (5).png) */}
      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span>Positionnement moyen par quartier ({formData.city} — {formData.neighborhood || 'Standard'})</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Zone standard : 300 000 FCFA/m² • Médiane Bastos/Bonapriso : 450 000 FCFA/m² • Excellence : 650 000 FCFA/m²+.
          Votre bien sera audité par nos équipes afin de calibrer sa visibilité auprès des acquéreurs certifiés.
        </p>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="text-slate-600 font-bold hover:text-slate-900 transition"
        >
          ← Retour
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!formData.price || isSubmitting}
          className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{isSubmitting ? 'Validation en cours...' : 'Soumettre mon bien pour validation'}</span>
        </button>
      </div>
    </div>
  );
}
