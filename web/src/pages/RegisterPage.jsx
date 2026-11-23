import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/immo.png';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    user_type: 'particular',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/my-account');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription. Vérifiez les champs saisis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="Immo du Letch" className="h-14 mx-auto object-contain" />
          <h2 className="text-xl font-extrabold text-[#0A1931]">Créer un compte certifié</h2>
          <p className="text-xs text-slate-500">Rejoignez le réseau immobilier de référence au Cameroun</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Type de compte</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'particular', label: 'Particulier' },
                { id: 'agent', label: 'Indépendant' },
                { id: 'agency', label: 'Agence' },
              ].map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFormData({ ...formData, user_type: t.id })}
                  className={`py-1.5 rounded-lg border text-center font-medium ${
                    formData.user_type === t.id
                      ? 'bg-[#0A1931] text-white border-[#0A1931]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nom complet ou Raison sociale</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Adresse Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Numéro de Téléphone (Cameroun / Intl)</label>
            <input
              type="tel"
              required
              placeholder="+237 6..."
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirmation</label>
              <input
                type="password"
                required
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-sm transition shadow-sm"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Vous avez déjà un compte ? </span>
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
