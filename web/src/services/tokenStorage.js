const KEY = 'token';

// Copie en mémoire : si le stockage du navigateur est indisponible (navigation privée...),
// la session reste utilisable jusqu'au rechargement de la page.
let memoryToken = null;

export const tokenStorage = {
  get() {
    if (memoryToken) return memoryToken;
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    memoryToken = token;
    try {
      localStorage.setItem(KEY, token);
    } catch {
      /* stockage indisponible */
    }
  },
  clear() {
    memoryToken = null;
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* rien à faire */
    }
  },
};