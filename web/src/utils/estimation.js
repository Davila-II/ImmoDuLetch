export function buildEstimationMessage({ location, assetType, area, name, phone }) {
  return [
    'Bonjour Immo du Letch, je souhaite faire estimer mon bien :',
    `- Localisation : ${location}`,
    `- Type : ${assetType}`,
    `- Superficie : ${area ? `${area} m²` : 'non précisée'}`,
    `- Nom : ${name}`,
    `- Téléphone : ${phone}`,
  ].join('\n');
}