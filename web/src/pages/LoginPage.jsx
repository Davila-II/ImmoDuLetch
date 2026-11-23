import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import logo from '../assets/immo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/my-account');
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects ou problème de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="Immo du Letch" className="h-14 mx-auto object-contain" />
          <h2 className="text-xl font-extrabold text-[#0A1931]">Espace Membre &amp; Propriétaire</h2>
          <p className="text-xs text-slate-500">Connectez-vous pour gérer vos annonces et vos demandes</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email ou Téléphone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com ou +237..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#0A1931]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#0A1931]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition shadow-sm"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Pas encore de compte ? </span>
          <Link to="/register" className="text-amber-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
