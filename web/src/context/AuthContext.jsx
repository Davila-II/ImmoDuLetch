import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaure la session au chargement de la page
  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        // L'API répond { user: {...} }
        if (active) setUser(response.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          // Jeton expiré ou révoqué : session terminée
          localStorage.removeItem('token');
          if (active) setUser(null);
        } else {
          // API injoignable ou erreur serveur : on garde le jeton pour ne pas déconnecter l'utilisateur
          console.error('Impossible de restaurer la session', err);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, []);

  // Déclenché par l'intercepteur d'api.js quand un appel renvoie 401
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: loggedUser } = response.data;
    localStorage.setItem('token', token);
    setUser(loggedUser);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Erreur logout API', e);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Recharge le profil (par exemple après un rattachement à une agence)
  const refreshUser = useCallback(async () => {
    const response = await api.get('/auth/me');
    setUser(response.data.user);
    return response.data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);