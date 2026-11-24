import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Alert from '../ui/Alert';
import SelectField from '../ui/SelectField';
import TextField from '../ui/TextField';
import { ESTIMATION_ASSET_TYPES } from '../../constants/siteContent';
import { platformWhatsAppLink } from '../../utils/contact';
import { buildEstimationMessage } from '../../utils/estimation';
import { normalizePhone } from '../../utils/phone';

const EMPTY_FORM = {
  location: '',
  assetType: ESTIMATION_ASSET_TYPES[0].value,
  area: '',
  name: '',
  phone: '',
};

export default function EstimationForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [whatsappUrl, setWhatsappUrl] = useState(null);

  const isConfigured = platformWhatsAppLink() !== null;
  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    const url = platformWhatsAppLink(
      buildEstimationMessage({
        ...form,
        location: form.location.trim(),
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
      })
    );
    if (!url) return;

    window.open(url, '_blank', 'noopener,noreferrer');
    setWhatsappUrl(url);
  };

  // Rien n'est enregistré par le site : la demande n'est reçue que si le message est envoyé dans WhatsApp
  if (whatsappUrl) {
    return (
      <div className="space-y-3">
        <Alert tone="info">
          WhatsApp s'est ouvert avec votre demande. <strong>Envoyez le message</strong> pour que notre équipe la reçoive.
          Si rien ne s'est ouvert, utilisez le bouton ci-dessous.
        </Alert>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ouvrir WhatsApp</span>
        </a>

        <div className="flex gap-4 text-xs">
          <button type="button" onClick={() => setWhatsappUrl(null)} className="text-slate-500 underline hover:text-slate-700">
            Modifier ma demande
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_FORM);
              setWhatsappUrl(null);
            }}
            className="text-slate-500 underline hover:text-slate-700"
          >
            Estimer un autre bien
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
      {!isConfigured && (
        <Alert>
          Cette fonction n'est pas disponible pour le moment.
          {import.meta.env.DEV && ' (Développement : définir VITE_WHATSAPP_NUMBER dans web/.env.local.)'}
        </Alert>
      )}

      <TextField
        id="estimation-location"
        label="Localisation du bien"
        type="text"
        required
        maxLength={150}
        placeholder="Ex : Douala, Bonapriso ou Yaoundé, Bastos"
        value={form.location}
        onChange={setField('location')}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          id="estimation-type"
          label="Type de bien"
          options={ESTIMATION_ASSET_TYPES}
          value={form.assetType}
          onChange={setField('assetType')}
        />
        <TextField
          id="estimation-area"
          label="Superficie (m²)"
          type="text"
          inputMode="numeric"
          maxLength={9}
          placeholder="Ex : 500"
          value={form.area}
          onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value.replace(/\D/g, '') }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="estimation-name"
          label="Votre nom"
          type="text"
          required
          autoComplete="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={setField('name')}
        />
        <TextField
          id="estimation-phone"
          label="Téléphone / WhatsApp"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+237 6..."
          value={form.phone}
          onChange={setField('phone')}
        />
      </div>

      <button
        type="submit"
        disabled={!isConfigured}
        className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-sm transition mt-2 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Envoyer ma demande par WhatsApp</span>
      </button>
    </form>
  );
}