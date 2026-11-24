// Un statut foncier est toujours présenté comme déclaré par le vendeur :
// la plateforme ne l'a pas vérifié elle-même.
export const LAND_STATUS_LABELS = {
  title_available: 'Titre foncier déclaré',
  document_verified: 'Document déclaré vérifié',
  document_unverified: 'Document non vérifié',
  to_verify: 'Audit recommandé',
};

export const getLandStatusLabel = (status) => LAND_STATUS_LABELS[status] ?? null;