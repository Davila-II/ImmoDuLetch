import FavoritesList from '../components/favorites/FavoritesList';
import FavoritesLoginPrompt from '../components/favorites/FavoritesLoginPrompt';
import { useAuth } from '../hooks/useAuth';

export default function FavoritesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user) return <FavoritesLoginPrompt />;

  // « key » : un autre utilisateur connecté repart d'une liste propre
  return <FavoritesList key={user.id} />;
}