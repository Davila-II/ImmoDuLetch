import { LAND_STATUS_LABELS } from '../constants/landStatus';

export const FILTER_KEYS = [
  'transaction_type',
  'category',
  'city',
  'q',
  'min_price',
  'max_price',
  'min_bedrooms',
  'land_status',
  'sort',
];

const ALLOWED_VALUES = {
  transaction_type: ['sale', 'rent'],
  sort: ['newest', 'price_asc', 'price_desc'],
  land_status: Object.keys(LAND_STATUS_LABELS),
};
const NUMERIC_KEYS = ['min_price', 'max_price', 'min_bedrooms'];

function clean(key, rawValue) {
  const value = (rawValue ?? '').trim();
  if (!value) return '';

  if (ALLOWED_VALUES[key]) return ALLOWED_VALUES[key].includes(value) ? value : '';
  if (NUMERIC_KEYS.includes(key)) return /^\d{1,12}$/.test(value) ? value : '';
  if (key === 'category') return /^[a-z0-9-]{1,100}$/.test(value) ? value : '';
  return value.slice(0, 100);
}

// Une adresse comme /properties?sort=nimporte ne doit pas provoquer d'erreur : la valeur est ignorée
export function readFilters(searchParams) {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, clean(key, searchParams.get(key))]));
}

export function toSearchParams(filters) {
  const params = new URLSearchParams();
  FILTER_KEYS.forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
  });
  return params;
}