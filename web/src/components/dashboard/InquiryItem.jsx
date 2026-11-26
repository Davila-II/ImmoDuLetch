import { Mail, Phone } from 'lucide-react';
import { INQUIRY_STATUS_BADGES, INQUIRY_TYPES } from '../../constants/statuses';
import { formatDate, formatDateTime } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';

export default function InquiryItem({ inquiry, busy, onStatusChange }) {
  const { t } = useLanguage();
  const badge = INQUIRY_STATUS_BADGES[inquiry.status] ?? INQUIRY_STATUS_BADGES.new;

  return (
    <div className="p-4 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{inquiry.name}</span>
          <span className="text-slate-400">{INQUIRY_TYPES[inquiry.type] ?? inquiry.type}</span>
          <span className={`px-2 py-0.5 rounded-full font-semibold border ${badge.className}`}>{badge.label}</span>
        </div>
        <span className="text-slate-400">{formatDate(inquiry.created_at)}</span>
      </div>

      {inquiry.property && (
        <p className="text-[11px] text-slate-500">
          Bien : <span className="font-mono font-bold">{inquiry.property.reference}</span>
          {inquiry.property.title ? ` — ${inquiry.property.title}` : ''}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        {inquiry.phone && (
          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:underline">
            <Phone className="w-3 h-3" /> {inquiry.phone}
          </a>
        )}
        {inquiry.email && (
          <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:underline">
            <Mail className="w-3 h-3" /> {inquiry.email}
          </a>
        )}
      </div>

      {inquiry.visit_at && (
        <p className="text-xs font-semibold text-[#0A1931]">Visite souhaitée le {formatDateTime(inquiry.visit_at)}</p>
      )}

      {inquiry.message && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{inquiry.message}</p>
      )}

      <div className="flex gap-3 text-xs">
        {inquiry.status === 'new' && (
          <button
            type="button"
            onClick={() => onStatusChange(inquiry, 'read')}
            disabled={busy}
            className="font-semibold text-[#0A1931] hover:underline disabled:opacity-50"
          >
            {t('dashboard.markAsRead', null, 'Marquer comme lu')}
          </button>
        )}
        {inquiry.status !== 'handled' && (
          <button
            type="button"
            onClick={() => onStatusChange(inquiry, 'handled')}
            disabled={busy}
            className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
          >
            {t('dashboard.markAsHandled', null, 'Marquer comme traité')}
          </button>
        )}
      </div>
    </div>
  );
}