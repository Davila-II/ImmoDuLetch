import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * useFavoriteToggle
 * Hook SRP qui encapsule toute la logique de gestion des favoris.
 *
 * Retourne :
 *   isFav          — état favori courant
 *   loadingFav     — requête en cours
 *   showLoginHint  — doit-on afficher le toast de connexion ?
 *   toggle         — handler à brancher sur onClick
 *   dismissHint    — masque le toast
 */
export function useFavoriteToggle(property) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(property?.is_favorite ?? false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  // Synchroniser quand la prop change (ex: chargement asynchrone sur fiche détail)
  useEffect(() => {
    if (property?.is_favorite !== undefined) {
      setIsFav(Boolean(property.is_favorite));
    }
  }, [property?.is_favorite]);

  const toggle = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Visiteur non-connecté → afficher le toast, ne pas appeler l'API
      if (!user) {
        setShowLoginHint(true);
        return;
      }

      if (!property?.reference) return;

      setLoadingFav(true);
      try {
        if (isFav) {
          await api.delete(`/properties/${property.reference}/favorite`);
          setIsFav(false);
        } else {
          await api.put(`/properties/${property.reference}/favorite`);
          setIsFav(true);
        }
      } catch (err) {
        console.error('Erreur favori:', err);
      } finally {
        setLoadingFav(false);
      }
    },
    [user, isFav, property?.reference],
  );

  const dismissHint = useCallback(() => setShowLoginHint(false), []);

  return { isFav, loadingFav, showLoginHint, toggle, dismissHint };
}
