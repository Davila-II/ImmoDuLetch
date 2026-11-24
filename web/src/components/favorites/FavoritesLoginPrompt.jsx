import { Link } from 'react-router-dom';
import { Heart, LogIn } from 'lucide-react';

export default function FavoritesLoginPrompt() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-7 h-7 fill-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-[#0A1931]">Vos favoris, sur tous vos appareils</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Connectez-vous pour retrouver les biens que vous avez enregistrés, sur mobile comme sur ordinateur.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            to="/login"
            state={{ from: '/favorites' }}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0A1931] text-white text-xs font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-800 transition"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>Se connecter</span>
          </Link>
          <Link to="/properties" className="text-xs text-slate-500 hover:text-slate-800 transition py-1">
            Continuer d'explorer les biens
          </Link>
        </div>
      </div>
    </div>
  );
}