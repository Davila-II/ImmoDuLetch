export const PROPERTY_STATUS_BADGES = {
  published: { label: 'Publiée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'En validation', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  rejected: { label: 'Refusée', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  suspended: { label: 'Suspendue', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  expired: { label: 'Expirée', className: 'bg-slate-100 text-slate-500 border-slate-300' },
};

// Seules ces annonces peuvent être reprises dans le formulaire de dépôt
export const EDITABLE_STATUSES = ['draft', 'rejected'];

export const INQUIRY_TYPES = {
  contact: 'Message',
  visit: 'Demande de visite',
  whatsapp: 'Clic WhatsApp',
  call: 'Clic Appeler',
};

export const INQUIRY_STATUS_BADGES = {
  new: { label: 'Nouveau', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  read: { label: 'Lu', className: 'bg-slate-100 text-slate-600 border-slate-300' },
  handled: { label: 'Traité', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};