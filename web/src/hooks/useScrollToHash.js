import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Fait défiler jusqu'à l'élément dont l'identifiant est dans l'adresse (/#estimation)
export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const element = document.getElementById(hash.slice(1));
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);
}