import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../services/api';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Il n'y a une session à restaurer que si un jeton est déjà enregistré
  const [loading, setLoading] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) return undefined;
    let active = true;

    authService
      .me()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          tokenStorage.clear();
          if (active) setUser(null);
        } else {
          // API injoignable : on garde le jeton pour ne pas perdre la session
          console.error('Impossible de restaurer la session', err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Déclenché par l'intercepteur d'api.js quand un appel renvoie 401
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  const startSession = useCallback((data) => {
    tokenStorage.set(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (credentials) => startSession(await authService.login(credentials)), [startSession]);

  const register = useCallback(async (payload) => startSession(await authService.register(payload)), [startSession]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Erreur logout API', err);
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authService.me();
    setUser(me);
    return me;
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}