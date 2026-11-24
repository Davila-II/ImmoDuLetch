import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import AuthCard from '../components/auth/AuthCard';
import Alert from '../components/ui/Alert';
import TextField from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { normalizeLoginIdentifier } from '../utils/phone';

export default function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from || '/my-account';

  const [form, setForm] = useState({ login: '', password: '' });
  const setField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const { submit, loading, error, fieldErrors } = useFormSubmit(
    () => login({ login: normalizeLoginIdentifier(form.login), password: form.password }),
    { fallback: 'Identifiants incorrects ou problème de connexion.' }
  );

  // Une fois connecté (ou déjà connecté), on revient à la page demandée
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <AuthCard
      title="Espace membre & propriétaire"
      subtitle="Connectez-vous pour gérer vos annonces et vos demandes"
      footer={
        <>
          <span>Pas encore de compte ? </span>
          <Link to="/register" className="text-amber-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      {error && <Alert>{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <TextField
          id="login"
          label="Email ou téléphone"
          icon={Mail}
          type="text"
          required
          autoComplete="username"
          placeholder="votre@email.com ou +237..."
          value={form.login}
          onChange={setField('login')}
          error={fieldErrors.login}
        />

        <TextField
          id="password"
          label="Mot de passe"
          icon={Lock}
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={setField('password')}
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition shadow-sm disabled:opacity-60"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </AuthCard>
  );
}