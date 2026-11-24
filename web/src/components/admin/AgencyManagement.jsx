import { useState } from 'react';
import { BadgeCheck, Plus, Shield, Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function AgencyManagement({
  agencies = [],
  loading = false,
  onToggleCertification,
  onCreateAgency,
  busyKey = null,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    city: 'Douala',
    neighborhood: '',
    phone: '',
    email: '',
    address: '',
    is_certified: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateAgency(form);
    setShowCreate(false);
    setForm({
      name: '',
      city: 'Douala',
      neighborhood: '',
      phone: '',
      email: '',
      address: '',
      is_certified: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Agences Partenaires ({agencies.length})</h2>
          <p className="text-xs text-slate-500">Gestion des agences immobilières certifiées et de leurs membres</p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-[#0A1931] hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Créer une agence</span>
        </button>
      </div>

      {/* Formulaire Création d'agence */}
      {showCreate && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in slide-in-from-top duration-200">
          <h3 className="font-bold text-sm text-[#0A1931]">Nouvelle agence immobilière</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Nom de l'agence *</label>
              <input
                type="text"
                required
                placeholder="Ex : Kribi Immobilier Prestige"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Ville</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Kribi">Kribi</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Quartier</label>
              <input
                type="text"
                placeholder="Ex : Bonanjo"
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Téléphone officiel</label>
              <input
                type="tel"
                placeholder="+237 6..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Email de contact</label>
              <input
                type="email"
                placeholder="contact@agence.cm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_certified"
                checked={form.is_certified}
                onChange={(e) => setForm({ ...form, is_certified: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="is_certified" className="font-semibold text-slate-700 cursor-pointer">
                Certifier l'agence dès la création
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold rounded-xl shadow-xs"
              >
                Enregistrer l'agence
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="text-xs text-slate-500">Chargement des agences…</p>}

      {!loading && agencies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agencies.map((agency) => {
            const isBusy = busyKey === agency.id;

            return (
              <div
                key={agency.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {agency.name}
                    </span>
                    {agency.is_certified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        <BadgeCheck className="w-3.5 h-3.5" /> Certifiée
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Non certifiée</span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {agency.city} — {agency.neighborhood || 'Quartier non précisé'}
                    </p>
                    {agency.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {agency.phone}
                      </p>
                    )}
                    {agency.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {agency.email}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-600">
                    <span>{agency.members_count || 0} agent(s)</span>
                    <span>•</span>
                    <span>{agency.properties_count || 0} annonce(s)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onToggleCertification(agency.id, !agency.is_certified)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      agency.is_certified
                        ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {agency.is_certified ? 'Retirer la certification' : 'Attribuer le badge Certifié'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
