import { useState } from 'react';
import Alert from '../ui/Alert';
import TextField from '../ui/TextField';
import { useAuth } from '../../hooks/useAuth';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { inquiryService } from '../../services/inquiryService';
import { normalizePhone } from '../../utils/phone';
import { useLanguage } from '../../context/LanguageContext';

function buildPayload(type, form) {
  const payload = { type, name: form.name.trim() };

  if (form.phone) payload.phone = normalizePhone(form.phone);
  if (form.email.trim()) payload.email = form.email.trim();
  if (form.message.trim()) payload.message = form.message.trim();
  // Envoyé avec le fuseau horaire du navigateur : l'heure reste la bonne quel que soit le serveur
  if (type === 'visit' && form.visitAt) payload.visit_at = new Date(form.visitAt).toISOString();

  return payload;
}

function InquiryFormBody({ reference, user }) {
  const { t } = useLanguage();
  const [type, setType] = useState('contact');
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    message: '',
    visitAt: '',
  });
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState(null);

  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const { submit, loading, error, fieldErrors } = useFormSubmit(
    () => inquiryService.send(reference, buildPayload(type, form)),
    { fallback: "Impossible d'envoyer votre demande. Réessayez." }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (type === 'visit' && !(new Date(form.visitAt) > new Date())) {
      setLocalError('Choisissez une date et une heure de visite à venir.');
      return;
    }

    const { ok } = await submit();
    if (ok) {
      setSent(true);
      setForm((prev) => ({ ...prev, message: '', visitAt: '' }));
    }
  };

  if (sent) {
    return (
      <div className="space-y-3">
        <Alert tone="success">
          {t('detail.inquirySuccess', null, 'Votre demande a bien été envoyée. Le propriétaire vous recontactera.')}
        </Alert>
        <button type="button" onClick={() => setSent(false)} className="text-xs font-semibold text-[#0A1931] hover:underline">
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div className="flex gap-2">
        {[
          { id: 'contact', label: t('detail.tabQuestion', null, 'Poser une question') },
          { id: 'visit', label: t('detail.tabVisit', null, 'Demander une visite') },
        ].map((option) => (
          <button
            type="button"
            key={option.id}
            onClick={() => setType(option.id)}
            className={`flex-1 py-1.5 rounded font-medium border ${
              type === option.id ? 'bg-[#0A1931] text-white border-[#0A1931]' : 'border-slate-200 text-slate-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {(error || localError) && <Alert>{localError || error}</Alert>}

      <TextField
        id="inquiry-name"
        label={t('estimation.nameLabel', null, 'Votre nom')}
        type="text"
        required
        autoComplete="name"
        value={form.name}
        onChange={setField('name')}
        error={fieldErrors.name}
      />
      <TextField
        id="inquiry-phone"
        label={t('estimation.phoneLabel', null, 'Téléphone')}
        type="tel"
        required
        autoComplete="tel"
        placeholder="+237 6..."
        value={form.phone}
        onChange={setField('phone')}
        error={fieldErrors.phone}
      />
      <TextField
        id="inquiry-email"
        label="Email (facultatif)"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={setField('email')}
        error={fieldErrors.email}
      />

      {type === 'visit' && (
        <TextField
          id="inquiry-visit"
          label={t('detail.desiredDate', null, 'Date et heure souhaitées')}
          type="datetime-local"
          required
          value={form.visitAt}
          onChange={setField('visitAt')}
          error={fieldErrors.visit_at}
        />
      )}

      <div>
        <label htmlFor="inquiry-message" className="block font-semibold text-slate-700 mb-1">
          {t('detail.yourMessage', null, 'Message (facultatif)')}
        </label>
        <textarea
          id="inquiry-message"
          rows="3"
          maxLength={1000}
          value={form.message}
          onChange={setField('message')}
          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2 rounded-lg text-xs transition disabled:opacity-60"
      >
        {loading ? 'Envoi...' : t('detail.sendInquiry', null, 'Envoyer ma demande')}
      </button>
    </form>
  );
}

// « key » : si l'utilisateur se connecte pendant que la page est ouverte, le formulaire est
// recréé avec ses informations de profil.
export default function InquiryForm({ reference }) {
  const { user } = useAuth();
  return <InquiryFormBody key={user?.id ?? 'guest'} reference={reference} user={user} />;
}