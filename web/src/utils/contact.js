import { normalizePhone } from './phone';

// Numéro au format international sans « + » pour wa.me (9 chiffres : on ajoute l'indicatif 237)
export function toWhatsAppNumber(phone) {
  const digits = normalizePhone(phone).replace(/\D/g, '');
  if (!digits) return null;
  return digits.length === 9 ? `237${digits}` : digits;
}

// Lien WhatsApp vers le propriétaire du bien. Sans numéro, on utilise celui de la plateforme
// (variable VITE_WHATSAPP_NUMBER, facultative) ; sinon, aucun lien.
export function whatsAppLink(phone, reference) {
  const number = toWhatsAppNumber(phone) || toWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER);
  if (!number) return null;

  const text = `Bonjour, je suis intéressé par votre bien réf. ${reference}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function phoneHref(phone) {
  const normalized = normalizePhone(phone);
  return normalized ? `tel:${normalized}` : null;
}