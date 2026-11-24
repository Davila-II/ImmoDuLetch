import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, LogIn } from 'lucide-react';

/**
 * LoginPromptToast
 * Toast non-bloquant affiché quand un visiteur non-connecté
 * tente d'ajouter un bien aux favoris.
 *
 * Props :
 *   onClose  — callback pour fermer le toast
 *   autoCloseMs — durée avant fermeture automatique (défaut : 4000 ms)
 */
export default function LoginPromptToast({ onClose, autoCloseMs = 4000 }) {
  const navigate = useNavigate();

  // Fermeture automatique après `autoCloseMs`
  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [onClose, autoCloseMs]);

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                 bg-[#0A1931] text-white px-4 py-3 rounded-xl shadow-2xl
                 animate-in slide-in-from-bottom-4 duration-300 max-w-sm w-full mx-4"
    >
      {/* Icône */}
      <span className="shrink-0 bg-rose-500 p-2 rounded-full">
        <Heart className="w-4 h-4 fill-white text-white" />
      </span>

      {/* Message */}
      <div className="flex-1 text-sm leading-snug">
        <p className="font-semibold">Connectez-vous pour sauvegarder</p>
        <p className="text-slate-300 text-xs mt-0.5">
          Vos favoris sont synchronisés sur tous vos appareils.
        </p>
      </div>

      {/* Bouton Se connecter */}
      <button
        onClick={handleLogin}
        className="shrink-0 flex items-center gap-1.5 bg-[#F5A623] hover:bg-amber-500
                   text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition"
      >
        <LogIn className="w-3.5 h-3.5" />
        Se connecter
      </button>

      {/* Fermer */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="shrink-0 text-slate-400 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
