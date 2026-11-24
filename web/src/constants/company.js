// Coordonnées affichées dans le pied de page : elles viennent de variables d'environnement
// (web/.env.local en développement, réglages Vercel en production).
const env = import.meta.env;

export const COMPANY = {
  name: 'Immo du Letch',
  phone: env.VITE_CONTACT_PHONE || '',
  email: env.VITE_CONTACT_EMAIL || '',
  address: env.VITE_CONTACT_ADDRESS || '',
};