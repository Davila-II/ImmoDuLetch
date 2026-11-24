import { useCallback, useState } from 'react';
import { extractApiError, getFieldErrors } from '../utils/apiError';

const IDLE = { loading: false, error: null, fieldErrors: {} };

export function useFormSubmit(action, { fallback } = {}) {
  const [state, setState] = useState(IDLE);

  const submit = useCallback(
    async (...args) => {
      setState({ ...IDLE, loading: true });
      try {
        const result = await action(...args);
        setState(IDLE);
        return { ok: true, result };
      } catch (err) {
        const fieldErrors = getFieldErrors(err);
        const hasFieldErrors = Object.keys(fieldErrors).length > 0;
        setState({
          loading: false,
          fieldErrors,
          // Une erreur de champ s'affiche sous le champ : pas de message général en double
          error: hasFieldErrors ? null : extractApiError(err, fallback),
        });
        return { ok: false };
      }
    },
    [action, fallback]
  );

  return { ...state, submit };
}