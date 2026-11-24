import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

const NOT_EXTRA = ['data', 'meta', 'links'];

// Sépare la réponse paginée de Laravel : éléments, total, pagination et champs supplémentaires (ex. « stats »)
function parse(payload) {
  return {
    items: payload.data,
    total: payload.meta.total,
    page: payload.meta.current_page,
    lastPage: payload.meta.last_page,
    extra: Object.fromEntries(Object.entries(payload).filter(([key]) => !NOT_EXTRA.includes(key))),
  };
}

// À utiliser avec une « key » qui change quand le chemin change : le composant est alors recréé,
// ce qui remet proprement l'état « chargement ».
export function usePaginatedResource(path) {
  const [state, setState] = useState({
    items: [],
    total: 0,
    page: 1,
    lastPage: 1,
    extra: {},
    loading: true,
    loadingMore: false,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    api
      .get(path, { params: { page: 1 } })
      .then(({ data }) => {
        if (active) setState({ ...parse(data), loading: false, loadingMore: false, error: null });
      })
      .catch(() => {
        if (active) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: 'Impossible de charger les données. Vérifiez votre connexion.',
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [path, reloadKey]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setReloadKey((key) => key + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (state.page >= state.lastPage) return;

    setState((prev) => ({ ...prev, loadingMore: true }));
    try {
      const { data } = await api.get(path, { params: { page: state.page + 1 } });
      const next = parse(data);
      setState((prev) => ({
        ...prev,
        items: [...prev.items, ...next.items],
        total: next.total,
        page: next.page,
        lastPage: next.lastPage,
        extra: next.extra,
        loadingMore: false,
      }));
    } catch {
      setState((prev) => ({ ...prev, loadingMore: false, error: 'Impossible de charger la suite.' }));
    }
  }, [path, state.page, state.lastPage]);

  const updateItems = useCallback((updater) => setState((prev) => ({ ...prev, items: updater(prev.items) })), []);
  const updateExtra = useCallback((updater) => setState((prev) => ({ ...prev, extra: updater(prev.extra) })), []);

  // Retire des éléments de la liste (par exemple un favori supprimé) et ajuste le total
  const removeWhere = useCallback(
    (predicate) =>
      setState((prev) => {
        const items = prev.items.filter((item) => !predicate(item));
        return { ...prev, items, total: Math.max(0, prev.total - (prev.items.length - items.length)) };
      }),
    []
  );

  return {
    items: state.items,
    total: state.total,
    extra: state.extra,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.page < state.lastPage,
    reload,
    loadMore,
    updateItems,
    updateExtra,
    removeWhere,
  };
}