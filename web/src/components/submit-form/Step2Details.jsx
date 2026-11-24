import { ShieldCheck, AlertTriangle, FileCheck, HelpCircle, Minus, Plus, Check } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

// Les identifiants correspondent aux valeurs acceptées par l'API
const LAND_STATUS_OPTIONS = [
  {
    id: 'title_available',
    title: 'Titre foncier déclaré disponible',
    desc: 'Certificat de propriété en possession du vendeur',
    icon: ShieldCheck,
  },
  {
    id: 'document_verified',
    title: 'Document vérifié par un professionnel',
    desc: 'Notaire ou géomètre',
    icon: FileCheck,
  },
  {
    id: 'document_unverified',
    title: 'Document fourni, non vérifié',
    desc: 'Dossier en attente de vérification',
    icon: AlertTriangle,
  },
  {
    id: 'to_verify',
    title: 'Situation foncière à vérifier',
    desc: 'Accompagnement requis',
    icon: HelpCircle,
  },
];

const onlyDigits = (value) => value.replace(/\D/g, '');

// Compteur -/+ : vide au départ (affiche un tiret), jamais de valeur imposée
function CounterField({ label, hint, value, onChange }) {
  const current = value === '' || value === null || value === undefined ? null : Number(value);

  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
      <div>
        <div className="font-bold text-slate-800">{label}</div>
        <div className="text-[10px] text-slate-500">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Diminuer : ${label}`}
          onClick={() => onChange(Math.max(0, (current ?? 0) - 1))}
          className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
        >
          <Minus className="w-3.5 h-3.5 text-slate-600" />
        </button>
        <span className="w-6 text-center font-bold text-sm text-[#0A1931]">{current ?? '—'}</span>
        <button
          type="button"
          aria-label={`Augmenter : ${label}`}
          onClick={() => onChange(Math.min(100, (current ?? 0) + 1))}
          className="w-7 h-7 rounded-lg bg-[#0A1931] text-white flex items-center justify-center hover:bg-slate-800"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Champ de surface : chiffres uniquement (l'API n'accepte que des nombres entiers)
function AreaField({ label, hint, placeholder, value, onChange }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          maxLength={9}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(onlyDigits(e.target.value))}
          className="w-full text-lg font-black text-[#0A1931] bg-white border border-slate-200 rounded-lg p-2.5 pr-10"
        />
        <span className="absolute right-3 top-3 text-slate-400 font-semibold">m²</span>
      </div>
      <span className="text-[11px] text-slate-400 mt-1 block">{hint}</span>
    </div>
  );
}

export default function Step2Details({ formData, onChange, onNext, onPrev, isSaving, missing = [] }) {
  const { amenities, isLoading, error } = useCatalog();
  const canContinue = missing.length === 0 && !isSaving;

  const toggleAmenity = (id) => {
    const current = formData.amenities || [];
    onChange('amenities', current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">MÉTROLOGIE &amp; VOLUMES</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Surfaces &amp; Agencement</h2>
        <p className="text-slate-500 mt-1">Indiquez au moins la superficie bâtie ou celle du terrain.</p>
      </div>

      {/* Surfaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AreaField
          label="Superficie bâtie"
          hint="Surface utile totale des bâtiments"
          placeholder="Ex : 380"
          value={formData.built_area}
          onChange={(v) => onChange('built_area', v)}
        />
        <AreaField
          label="Superficie du terrain / parcelle"
          hint="Superficie totale de la parcelle"
          placeholder="Ex : 1200"
          value={formData.land_area}
          onChange={(v) => onChange('land_area', v)}
        />
      </div>

      {/* Composition des espaces */}
      <div className="space-y-3">
        <label className="block font-bold text-slate-700 uppercase tracking-wider">Composition des espaces</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CounterField
            label="Nombre de pièces"
            hint="Salons, séjours, bureaux"
            value={formData.rooms}
            onChange={(v) => onChange('rooms', v)}
          />
          <CounterField
            label="Chambres"
            hint="Suites et chambres"
            value={formData.bedrooms}
            onChange={(v) => onChange('bedrooms', v)}
          />
          <CounterField
            label="Salles de bain"
            hint="Bains et salles d'eau"
            value={formData.bathrooms}
            onChange={(v) => onChange('bathrooms', v)}
          />
        </div>
      </div>

      {/* Statut foncier : aucun choix par défaut */}
      <div className="space-y-3 pt-2">
        <label className="block font-bold text-slate-700 uppercase tracking-wider">
          Statut juridique &amp; foncier de la parcelle <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LAND_STATUS_OPTIONS.map((status) => {
            const Icon = status.icon;
            const isSelected = formData.land_status === status.id;

            return (
              <button
                type="button"
                key={status.id}
                onClick={() => onChange('land_status', status.id)}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 relative ${
                  isSelected
                    ? 'border-[#0A1931] bg-[#0A1931] text-white shadow-md'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10 text-amber-400' : 'bg-white text-slate-600 shadow-xs'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">{status.title}</div>
                  <div className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{status.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 absolute top-3 right-3 stroke-3" />}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400">Ces informations sont déclarées par le vendeur.</p>
      </div>

      {/* Équipements, chargés depuis l'API, aucun coché par défaut */}
      <div className="space-y-3 pt-2">
        <label className="block font-bold text-slate-700 uppercase tracking-wider">
          Prestations &amp; équipements
        </label>

        {isLoading && <p className="text-slate-400">Chargement des équipements…</p>}
        {error && <p className="text-rose-600">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {amenities.map((amenity) => {
            const active = (formData.amenities || []).includes(amenity.id);

            return (
              <button
                type="button"
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-3 rounded-xl border text-left font-semibold flex items-center justify-between transition ${
                  active
                    ? 'bg-[#0A1931] text-white border-[#0A1931]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-400' : 'bg-slate-300'}`} />
                  {amenity.name}
                </span>
                {active && <Check className="w-4 h-4 text-amber-400 stroke-3" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-100">
        <button type="button" onClick={onPrev} className="text-slate-600 font-bold hover:text-slate-900 transition">
          ← Retour
        </button>

        <div className="flex items-center gap-4">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {missing.length > 0 ? `À renseigner : ${missing.map((item) => item.label).join(', ')}` : ''}
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue}
            className="bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isSaving ? 'Enregistrement...' : 'Continuer vers Photos & Médias'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}