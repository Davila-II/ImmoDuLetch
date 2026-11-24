import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, LogIn } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../hooks/useAuth';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.data || response.data || []);
    } catch (err) {
      console.error('Erreur favoris', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchFavorites();
    }
  }, [user, authLoading]);

  const handleRemoveFavorite = (reference) => {
    setFavorites(prev => prev.filter(p => p.reference !== reference));
  };

  if (!authLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0A1931]">Vos Favoris synchronisés</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connectez-vous à votre compte Immo du Letch pour retrouver l'ensemble de vos biens enregistrés sur mobile ou ordinateur.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0A1931] text-white text-xs font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-800 transition"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Se connecter</span>
            </Link>
            <Link
              to="/properties"
              className="text-xs text-slate-500 hover:text-slate-800 transition py-1"
            >
              Continuer d'explorer les biens
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-[#0A1931] flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-current" />
          <span>Mes Favoris ({favorites.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Retrouvez les biens immobiliers que vous avez sélectionnés</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <PropertyCard 
              key={prop.reference} 
              property={prop} 
              onFavoriteToggle={() => handleRemoveFavorite(prop.reference)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Aucun bien en favori pour le moment</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explorez notre sélection de biens certifiés au Cameroun et cliquez sur le cœur pour les retrouver ici.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-[#0A1931] text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition"
          >
            <span>Découvrir les annonces</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      )}
    </div>
  );
}
