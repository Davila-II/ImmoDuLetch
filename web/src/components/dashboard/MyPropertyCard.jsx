import { Link } from 'react-router-dom';
import { Edit3, ExternalLink, Eye, MessageSquare, Trash2 } from 'lucide-react';
import { EDITABLE_STATUSES, PROPERTY_STATUS_BADGES } from '../../constants/statuses';
import { formatPrice } from '../../utils/format';

const UNKNOWN_BADGE = { className: 'bg-slate-50 text-slate-600 border-slate-200' };

export default function MyPropertyCard({ property, busy, onDelete }) {
  const badge = PROPERTY_STATUS_BADGES[property.status] ?? { ...UNKNOWN_BADGE, label: property.status };
  const editable = EDITABLE_STATUSES.includes(property.status);
  const reason =
    property.status === 'rejected' || property.status === 'suspended' ? property.rejection_reason : null;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4 shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-slate-400">Réf : {property.reference}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badge.className}`}>{badge.label}</span>
        </div>
        <h3 className="font-bold text-slate-900 text-base">{property.title || 'Annonce sans titre'}</h3>
        <p className="text-xs text-slate-500 mt-1">
          {property.city || 'Ville non renseignée'} — {property.neighborhood || 'Quartier non renseigné'}
        </p>
        <div className="text-lg font-black text-[#0A1931] mt-2">{formatPrice(property, 'Prix non défini')}</div>

        {reason && (
          <p className="mt-3 text-xs bg-rose-50 border border-rose-100 text-rose-700 rounded-lg p-2.5">
            <span className="font-bold">Motif : </span>
            {reason}
          </p>
        )}
        {property.status === 'pending' && (
          <p className="mt-3 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg p-2.5">
            Votre annonce est en cours d'examen par notre équipe.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {property.views_count || 0} vues
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {property.contacts_count || 0} contacts
          </span>
        </div>

        <div className="flex items-center gap-3">
          {editable && (
            <Link
              to={`/deposer/${property.reference}`}
              className="text-[#0A1931] font-semibold hover:underline flex items-center gap-1 py-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{property.status === 'rejected' ? 'Corriger' : 'Reprendre'}</span>
            </Link>
          )}
          {property.status === 'published' && (
            <Link
              to={`/properties/${property.reference}`}
              className="text-amber-600 font-semibold hover:underline flex items-center gap-1 py-1"
            >
              <span>Voir</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          {editable && (
            <button
              type="button"
              onClick={() => onDelete(property)}
              disabled={busy}
              className="text-rose-600 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50 py-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
