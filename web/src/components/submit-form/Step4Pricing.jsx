import { ShieldCheck, Info } from 'lucide-react';

const MAX_DESCRIPTION = 5000;
const onlyDigits = (value) => value.replace(/\D/g, '');

export default function Step4Pricing({
  formData,
  onChange,
  onPrev,
  onSubmit,
  isSubmitting,
  missing = [],
  onGoToStep,
}) {
  const price = parseInt(formData.price || 0, 10);
  const area = parseInt(formData.built_area || formData.land_area || 0, 10);
  const pricePerSqm = price > 0 && area > 0 ? Math.round(price / area) : 0;
  const format = (n) => new Intl.NumberFormat('fr-FR').format(n);
  const canSubmit = missing.length === 0 && !isSubmitting;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PRIX &amp; PUBLICATION</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Prix net vendeur &amp; envoi</h2>
        <p className="text-slate-500 mt-1">Fixez votre prix, décrivez le bien, puis envoyez l'annonce pour validation.</p>
      </div>

      {/* Prix */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
        <label className="block font-bold text-slate-800 uppercase tracking-wider text-xs">
          Prix net vendeur souhaité (FCFA) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            placeholder="Ex : 185000000"
            value={formData.price}
            onChange={(e) => onChange('price', onlyDigits(e.target.value))}
            className="w-full text-2xl font-black text-[#0A1931] bg-white border border-slate-200 rounded-xl p-3.5 pr-20"
          />
          <span className="absolute right-4 top-4 font-bold text-slate-400 text-sm">FCFA</span>
        </div>

        {price > 0 && <p className="text-slate-600 font-semibold">{format(price)} FCFA</p>}

        {pricePerSqm > 0 && (
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span>Prix au m² calculé :</span>
            <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[#0A1931]">
              {format(pricePerSqm)} FCFA / m²
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
          Description du bien <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows="5"
          maxLength={MAX_DESCRIPTION}
          placeholder="Détaillez les atouts du bien : accès, finitions, état, environnement, commodités…"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
        ></textarea>
        <p className="text-[11px] text-slate-400 mt-1 text-right">
          {(formData.description || '').length} / {MAX_DESCRIPTION}
        </p>
      </div>

      {/* Visite 3D */}
      <div>
        <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Lien de visite virtuelle 3D (optionnel)
        </label>
        <input
          type="url"
          maxLength={255}
          placeholder="https://my.matterport.com/show/?m=..."
          value={formData.virtual_tour_url || ''}
          onChange={(e) => onChange('virtual_tour_url', e.target.value)}
          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
        />
      </div>

      {/* Information sur la validation (aucun chiffre de marché affiché) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          Avant d'être publiée, chaque annonce est examinée par notre équipe (informations, photos, cohérence du prix).
          Vous pourrez suivre son statut dans « Mes annonces ».
        </p>
      </div>

      {/* Ce qu'il reste à compléter, avec accès direct à l'étape concernée */}
      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="font-bold text-amber-900">À compléter avant l'envoi :</div>
          <div className="flex flex-wrap gap-2">
            {missing.map((item) => (
              <button
                type="button"
                key={item.field}
                onClick={() => onGoToStep?.(item.step)}
                className="px-2.5 py-1 rounded-full bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition"
              >
                {item.label} <span className="text-amber-600">(étape {item.step})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <button type="button" onClick={onPrev} className="text-slate-600 font-bold hover:text-slate-900 transition">
          ← Retour
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer mon annonce pour validation'}</span>
        </button>
      </div>
    </div>
  );
}