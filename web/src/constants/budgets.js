import { formatNumber } from '../utils/format';

const toOptions = (values, suffix = '') =>
  values.map((value) => ({ value: String(value), label: `${formatNumber(value)} FCFA${suffix}` }));

// Budget maximum proposé : les tranches ne sont pas les mêmes pour une vente et une location
export const SALE_BUDGET_OPTIONS = toOptions([25_000_000, 50_000_000, 100_000_000, 200_000_000, 350_000_000, 500_000_000]);
export const RENT_BUDGET_OPTIONS = toOptions([100_000, 200_000, 350_000, 500_000, 1_000_000, 2_500_000], ' / mois');

export const getBudgetOptions = (transactionType) =>
  transactionType === 'rent' ? RENT_BUDGET_OPTIONS : SALE_BUDGET_OPTIONS;