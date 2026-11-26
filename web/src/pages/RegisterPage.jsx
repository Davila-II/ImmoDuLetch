import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import Alert from '../components/ui/Alert';
import TextField from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { normalizePhone } from '../utils/phone';
import { useLanguage } from '../context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { user, register } = useAuth();

  const accountTypes = [
    { id: 'particulier', label: t('auth.individual', null, 'Particulier') },
    { id: 'independant', label: t('auth.independent', null, 'Indépendant') },
  ];

  const [form, setForm] = useState({
    account_type: 'particulier',
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const { submit, loading, error, fieldErrors } = useFormSubmit(
    () =>
      register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: normalizePhone(form.phone),
      }),
    { fallback: 'Impossible de créer le compte. Réessayez.' }
  );

  if (user) return <Navigate to="/my-account" replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <AuthCard
      title={t('auth.registerTitle', null, 'Créer un compte')}
      subtitle={t('auth.registerSubtitle', null, 'Rejoignez la plateforme immobilière Immo du Letch')}
      footer={
        <>
          <span>{t('auth.haveAccount', null, 'Vous avez déjà un compte ?')} </span>
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">
            {t('favorites.loginButton', null, 'Se connecter')}
          </Link>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <span className="block font-semibold text-slate-700 mb-1">{t('auth.accountTypeLabel', null, 'Type de compte')}</span>
          <div className="grid grid-cols-2 gap-2">
            {accountTypes.map((type) => (
              <button
                type="button"
                key={type.id}
                onClick={() => setForm((prev) => ({ ...prev, account_type: type.id }))}
                className={`py-1.5 rounded-lg border text-center font-medium ${
                  form.account_type === type.id
                    ? 'bg-[#0A1931] text-white border-[#0A1931]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {t('auth.agencyNotice', null, 'Vous êtes une agence ? Contactez-nous : les comptes agence sont créés par notre équipe.')}
          </p>
        </div>

        <TextField
          id="name"
          label={t('auth.fullNameLabel', null, 'Nom complet')}
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={setField('name')}
          error={fieldErrors.name}
        />

        <TextField
          id="email"
          label={t('auth.emailLabel', null, 'Adresse email')}
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={setField('email')}
          error={fieldErrors.email}
        />

        <TextField
          id="phone"
          label={t('auth.phoneLabel', null, 'Numéro de téléphone / WhatsApp')}
          type="tel"
          required
          autoComplete="tel"
          placeholder="+237 6..."
          value={form.phone}
          onChange={setField('phone')}
          error={fieldErrors.phone}
        />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="password"
            label={t('auth.passwordLabel', null, 'Mot de passe')}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={setField('password')}
            error={fieldErrors.password}
          />
          <TextField
            id="password_confirmation"
            label={t('auth.passwordConfirmationLabel', null, 'Confirmation')}
            type="password"
            required
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={setField('password_confirmation')}
          />
        </div>
        <p className="text-[11px] text-slate-400 -mt-2">8 caractères minimum.</p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-60"
        >
          {loading ? 'Création...' : t('auth.registerSubmit', null, 'Créer mon compte')}
        </button>
      </form>
    </AuthCard>
  );
}