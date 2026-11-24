import { useCallback, useState } from 'react';
import { propertyService } from '../services/propertyService';
import { useAuth } from './useAuth';

export function useFavoriteToggle(property) {
  const { user } = useAuth();
  const reference = property?.reference;
  // Valeur envoyée par l'API (présente seulement pour un utilisateur connecté)
  const serverValue = Boolean(property?.is_favorite);

  // Valeur choisie par l'utilisateur, valable tant que l'API ne renvoie pas autre chose
  const [override, setOverride] = useState(null);
  const isFav =
    override && override.reference === reference && override.base === serverValue ? override.value : serverValue;

  const [loadingFav, setLoadingFav] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const toggle = useCallback(
    async (event) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (!user) {
        setShowLoginHint(true);
        return null;
      }
      if (!reference) return null;

      const next = !isFav;
      setLoadingFav(true);
      try {
        await propertyService.setFavorite(reference, next);
        setOverride({ reference, base: serverValue, value: next });
        return next;
      } catch (err) {
        console.error('Erreur favori :', err);
        return null;
      } finally {
        setLoadingFav(false);
      }
    },
    [user, reference, isFav, serverValue]
  );

  const dismissHint = useCallback(() => setShowLoginHint(false), []);

  return { isFav, loadingFav, showLoginHint, toggle, dismissHint };
}