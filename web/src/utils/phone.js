// « +237 699-45.28.10 » -> « +237699452810 » (l'API n'accepte que des chiffres et un « + » initial)
export function normalizePhone(value) {
  const cleaned = String(value ?? '').replace(/[\s.\-()]/g, '');
  return cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
}

// Identifiant de connexion : un email reste tel quel, sinon c'est un numéro de téléphone
export function normalizeLoginIdentifier(value) {
  const text = String(value ?? '').trim();
  return text.includes('@') ? text : normalizePhone(text);
}