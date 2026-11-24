import { useEffect, useState } from 'react';
import { propertyService } from '../services/propertyService';

const LOADING = { property: null, similar: [], loading: true, notFound: false, error: null };

// À utiliser avec une « key » = la référence : le composant est recréé à chaque changement de bien
export function usePropertyDetail(reference) {
  const [state, setState] = useState(LOADING);

  useEffect(() => {
    let active = true;

    Promise.all([propertyService.get(reference), propertyService.similar(reference).catch(() => [])])
      .then(([property, similar]) => {
        if (active) setState({ property, similar, loading: false, notFound: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        const notFound = err.response?.status === 404;
        setState({
          property: null,
          similar: [],
          loading: false,
          notFound,
          error: notFound ? null : 'Impossible de charger ce bien. Vérifiez votre connexion.',
        });
      });

    return () => {
      active = false;
    };
  }, [reference]);

  return state;
}