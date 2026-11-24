const numberFormat = new Intl.NumberFormat('fr-FR');

export const formatNumber = (value) => numberFormat.format(value);

// « 380 000 000 FCFA », ou « 1 200 000 FCFA / mois » pour une location
export function formatPrice(property, emptyLabel = 'Prix sur demande') {
  if (!property?.price) return emptyLabel;

  const amount = `${numberFormat.format(property.price)} FCFA`;
  return property.transaction_type === 'rent' ? `${amount} / mois` : amount;
}

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString('fr-FR') : '');

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }) : '';