import { useCallback, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useCarousel(length, { intervalMs = 6000 } = {}) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false); // bouton pause
  const [hovered, setHovered] = useState(false); // souris ou clavier sur le carrousel
  const reducedMotion = usePrefersReducedMotion();

  const playing = length > 1 && !userPaused && !hovered && !reducedMotion;

  useEffect(() => {
    if (!playing) return undefined;

    const timer = setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => clearInterval(timer);
  }, [playing, length, intervalMs]);

  const next = useCallback(() => setIndex((current) => (current + 1) % length), [length]);
  const prev = useCallback(() => setIndex((current) => (current - 1 + length) % length), [length]);
  const goTo = useCallback((target) => setIndex(target), []);
  const togglePause = useCallback(() => setUserPaused((paused) => !paused), []);

  return { index, next, prev, goTo, playing, userPaused, togglePause, setHovered };
}