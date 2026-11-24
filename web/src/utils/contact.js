import api from '../services/api';

// Transforme un numéro saisi (« +237 699 45 28 10 », « 699452810 »…) en numéro international pour wa.me
export function toWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;

  // Numéro camerounais à 9 chiffres sans indicatif : on ajoute 237
  return digits.length === 9 ? `237${digits}` : digits;
}

// Lien WhatsApp vers le propriétaire du bien. Si le bien n'a pas de numéro, on utilise
// celui de la plateforme (variable VITE_WHATSAPP_NUMBER, facultative) ; sinon, aucun lien.
export function whatsAppLink(phone, reference) {
  const number = toWhatsAppNumber(phone) || toWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER);
  if (!number) return null;

  const text = `Bonjour, je suis intéressé par votre bien réf. ${reference}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Enregistre un clic « WhatsApp » ou « Appeler » : il alimente le compteur de contacts du propriétaire.
// Sans attente et sans erreur visible : un échec ne doit jamais empêcher d'ouvrir WhatsApp.
export function trackContact(reference, type) {
  api.post(`/properties/${reference}/inquiries`, { type }).catch(() => {});
}