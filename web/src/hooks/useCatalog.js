import { useEffect, useState } from 'react';
import api from '../services/api';

// Promesse partagée : les listes changent rarement, on ne les charge qu'une fois
let cache = null;

function loadCatalog() {
  if (!cache) {
    cache = Promise.all([api.get('/categories'), api.get('/amenities')])
      .then(([categories, amenities]) => ({
        categories: categories.data.data,
        amenities: amenities.data.data,
      }))
      .catch((err) => {
        cache = null; // permet de réessayer au prochain affichage
        throw err;
      });
  }
  return cache;
}

export function useCatalog() {
  const [state, setState] = useState({
    categories: [],
    amenities: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    loadCatalog()
      .then((data) => {
        if (active) setState({ ...data, isLoading: false, error: null });
      })
      .catch(() => {
        if (active) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Impossible de charger les catégories et les équipements. Rechargez la page.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}