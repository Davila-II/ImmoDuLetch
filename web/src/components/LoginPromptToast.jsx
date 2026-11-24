import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, LogIn, X } from 'lucide-react';

/**
 * Toast non bloquant affiché quand un visiteur non connecté tente d'ajouter un bien aux favoris.
 *
 * Props :
 *   onClose     — fermeture du toast (doit être une fonction stable)
 *   autoCloseMs — durée avant fermeture automatique (défaut : 4000 ms)
 */
export default function LoginPromptToast({ onClose, autoCloseMs = 4000 }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [onClose, autoCloseMs]);

  // Après la connexion, on revient sur la page où l'utilisateur se trouvait
  const handleLogin = () => {
    onClose();
    navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 sm:gap-3
                 bg-[#0A1931] text-white px-3.5 sm:px-4 py-3 rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-sm"
    >
      <span className="shrink-0 bg-rose-500 p-2 rounded-full">
        <Heart className="w-4 h-4 fill-white text-white" />
      </span>

      <div className="flex-1 text-xs sm:text-sm leading-snug overflow-hidden">
        <p className="font-semibold truncate">Connectez-vous pour sauvegarder</p>
        <p className="text-slate-300 text-[11px] sm:text-xs mt-0.5 truncate">Synchronisez vos favoris partout.</p>
      </div>

      <button
        type="button"
        onClick={handleLogin}
        className="shrink-0 flex items-center gap-1 bg-[#F5A623] hover:bg-amber-500
                   text-slate-950 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Connexion</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="shrink-0 text-slate-400 hover:text-white transition p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
