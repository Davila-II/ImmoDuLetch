import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// En production, une adresse d'API manquante donnerait un site vide, sans explication
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    "VITE_API_URL n'est pas défini : le site essaie de joindre l'API locale (127.0.0.1) et ne fonctionnera pas."
  );
}

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jeton expiré ou révoqué : on le supprime et on prévient l'application,
// qui remet l'utilisateur à l'état « déconnecté » (voir AuthContext).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(localStorage.getItem('token'));

    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:expired'));
    }

    return Promise.reject(error);
  }
);

export default api;