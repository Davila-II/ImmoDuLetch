import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Ban, RefreshCw, Star, Award, ExternalLink, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { PROPERTY_STATUS_BADGES } from '../../constants/statuses';

export default function ModerationQueue({
  properties = [],
  loading = false,
  statusFilter = 'pending',
  onStatusFilterChange,
  onApprove,
  onReject,
  onSuspend,
  onReinstate,
  onToggleFlags,
  busyKey = null,
}) {
  const [rejectModal, setRejectModal] = useState({ open: false, reference: null, reason: '' });
  const [actionError, setActionError] = useState(null);

  const STATUS_TABS = [
    { id: 'pending', label: 'En attente' },
    { id: 'published', label: 'Publiées' },
    { id: 'suspended', label: 'Suspendues' },
    { id: 'rejected', label: 'Refusées' },
    { id: '', label: 'Toutes' },
  ];

  const handleOpenReject = (ref) => {
    setRejectModal({ open: true, reference: ref, reason: '' });
    setActionError(null);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModal.reason.trim()) {
      setActionError('Le motif de refus est obligatoire pour informer le vendeur.');
      return;
    }
    await onReject(rejectModal.reference, rejectModal.reason.trim());
    setRejectModal({ open: false, reference: null, reason: '' });
  };

  return (
    <div className="space-y-4">
      {/* Onglets de filtrage par statut */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {STATUS_TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onStatusFilterChange(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              statusFilter === tab.id
                ? 'bg-[#0A1931] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-8 text-center text-xs text-slate-500">
          Chargement de la file de modération…
        </div>
      )}

      {!loading && properties.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Aucune annonce trouvée pour ce statut.
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="space-y-3">
          {properties.map((prop) => {
            const badge = PROPERTY_STATUS_BADGES[prop.status] || { label: prop.status, className: 'bg-slate-100' };
            const isBusy = busyKey === prop.reference;

            return (
              <div
                key={prop.reference}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Infos bien */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {prop.reference}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.className}`}>
                      {badge.label}
                    </span>
                    {prop.is_exclusive && (
                      <span className="bg-[#F5A623] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Exclusivité
                      </span>
                    )}
                    {prop.is_featured && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Coup de cœur
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    <Link to={`/properties/${prop.reference}`} target="_blank" className="hover:underline flex items-center gap-1.5">
                      <span>{prop.title || 'Annonce sans titre'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500">
                    {prop.city} — {prop.neighborhood || 'Quartier non précisé'} • {formatPrice(prop)} •{' '}
                    <span className="text-slate-700 font-medium">Vendeur : {prop.user?.name || 'Inconnu'}</span>
                  </p>

                  {prop.rejection_reason && (
                    <p className="text-xs bg-rose-50 text-rose-700 p-2 rounded-lg mt-1 border border-rose-100">
                      <strong>Motif de refus : </strong>{prop.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Actions de modération */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  {/* Boutons d'approbation et refus pour les annonces en attente */}
                  {prop.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onApprove(prop.reference)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition disabled:opacity-50"
                        title="Approuver et publier immédiatement"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approuver</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleOpenReject(prop.reference)}
                        className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition disabled:opacity-50"
                        title="Rejeter avec motif"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Refuser</span>
                      </button>
                    </>
                  )}

                  {/* Suspension / Rétablissement pour les annonces publiées */}
                  {prop.status === 'published' && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onSuspend(prop.reference)}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold px-3 py-2 rounded-xl text-xs transition disabled:opacity-50"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspendre</span>
                    </button>
                  )}

                  {prop.status === 'suspended' && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onReinstate(prop.reference)}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold px-3 py-2 rounded-xl text-xs transition disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Rétablir</span>
                    </button>
                  )}

                  {/* Toggles Mises en avant */}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onToggleFlags(prop.reference, { is_exclusive: !prop.is_exclusive, is_featured: prop.is_featured })}
                    className={`p-2 rounded-xl border transition text-xs ${
                      prop.is_exclusive
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={prop.is_exclusive ? "Retirer l'exclusivité" : "Marquer comme exclusivité Letch"}
                  >
                    <Award className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onToggleFlags(prop.reference, { is_exclusive: prop.is_exclusive, is_featured: !prop.is_featured })}
                    className={`p-2 rounded-xl border transition text-xs ${
                      prop.is_featured
                        ? 'bg-[#0A1931] text-amber-400 border-[#0A1931]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={prop.is_featured ? "Retirer le coup de cœur" : "Mettre en coup de cœur"}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Rejet d'annonce avec motif */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">Motif de refus de l'annonce</h3>
            <p className="text-xs text-slate-500">
              Précisez au vendeur ce qui doit être corrigé (photos non conformes, titre foncier manquant, prix incohérent...).
            </p>

            {actionError && (
              <div className="text-xs bg-rose-50 text-rose-700 p-2.5 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                required
                rows="4"
                placeholder="Ex : Veuillez fournir des photos plus nettes et vérifier le numéro de lot."
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#0A1931]"
              />

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, reference: null, reason: '' })}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirmer le refus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
