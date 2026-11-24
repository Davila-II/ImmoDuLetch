const DEFAULT_LABELS = {
  login: 'Identifiant',
  email: 'Email',
  phone: 'Téléphone',
  password: 'Mot de passe',
  name: 'Nom',
  message: 'Message',
  visit_at: 'Date de visite',
  account_type: 'Type de compte',
};

// Erreurs de validation (422) : { champ: premier message }
export function getFieldErrors(err) {
  const errors = err?.response?.status === 422 ? err.response.data?.errors : null;
  if (!errors) return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field.split('.')[0], messages[0]])
  );
}

// Message lisible pour n'importe quelle erreur d'appel à l'API
export function extractApiError(err, fallback = 'Une erreur est survenue.', labels = {}) {
  if (!err?.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion.';

  const { status } = err.response;
  if (status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer.';
  if (status === 403) return "Vous n'avez pas le droit d'effectuer cette action.";
  if (status === 429) return 'Trop de tentatives. Réessayez dans une minute.';

  const fieldErrors = getFieldErrors(err);
  if (Object.keys(fieldErrors).length > 0) {
    const allLabels = { ...DEFAULT_LABELS, ...labels };
    return Object.entries(fieldErrors)
      .map(([field, message]) => `${allLabels[field] || field} : ${message}`)
      .join(' • ');
  }

  return fallback;
}