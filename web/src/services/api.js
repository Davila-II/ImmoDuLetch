import axios from 'axios';
import { tokenStorage } from './tokenStorage';

export const AUTH_EXPIRED_EVENT = 'auth:expired';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// En production, une adresse d'API manquante donnerait un site vide, sans explication
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL n'est pas défini : le site essaie de joindre l'API locale et ne fonctionnera pas.");
}

const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Jeton expiré ou révoqué : on le supprime et on prévient l'application (voir AuthProvider)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default api;