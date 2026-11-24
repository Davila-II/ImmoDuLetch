import React from 'react';
import { ShieldCheck } from 'lucide-react';

// Libellés des statuts fonciers : toujours présentés comme déclarés par le vendeur
const LAND_STATUS_LABELS = {
  title_available: 'Titre foncier déclaré disponible',
  document_verified: 'Document vérifié par un professionnel',
  document_unverified: 'Document fourni, non vérifié',
  to_verify: 'Situation foncière à vérifier',
};

const isEmpty = (value) => value === '' || value === null || value === undefined;
const show = (value, unit = '') => (isEmpty(value) ? '—' : `${value}${unit}`);

export default function LivePreviewCard({ formData, images = [] }) {
  const price = Number(formData.price);
  const formattedPrice =
    price > 0 ? `${new Intl.NumberFormat('fr-FR').format(price)} FCFA` : 'Prix non défini';

  // Les photos viennent du serveur : la première est la photo de vitrine
  const previewImage = images.length > 0 ? images[0].url : null;
  const landStatusLabel = LAND_STATUS_LABELS[formData.land_status];

  return (
    <div className="space-y-6 sticky top-24">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Aperçu en direct de l'annonce
        </span>
        <span className="text-slate-400">Vue acquéreur</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition">
        {/* Photo de vitrine */}
        <div className="relative aspect-16/10 bg-slate-900 overflow-hidden flex items-center justify-center">
          {previewImage ? (
            <img src={previewImage} alt="Aperçu de l'annonce" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-slate-500 text-xs p-4">
              <span>Aucune photo chargée</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-[#0A1931] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {formData.transaction_type === 'rent' ? 'Location' : 'Vente'}
            </span>
          </div>

          {images.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {images.length} photo{images.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {formData.city || 'Ville'} • {formData.neighborhood || 'Quartier'}
          </div>

          <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
            {formData.title || 'Titre de votre annonce…'}
          </h3>

          <div className="text-2xl font-black text-[#0A1931]">{formattedPrice}</div>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">{show(formData.built_area, ' m²')}</div>
              <div className="text-[10px] text-slate-400">Surface bâtie</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{show(formData.bedrooms)}</div>
              <div className="text-[10px] text-slate-400">Chambres</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{show(formData.land_area, ' m²')}</div>
              <div className="text-[10px] text-slate-400">Terrain</div>
            </div>
          </div>

          {/* Statut foncier : affiché seulement s'il a été choisi, et toujours comme déclaré */}
          {landStatusLabel && (
            <div className="pt-1 space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>{landStatusLabel}</span>
              </span>
              <p className="text-[10px] text-slate-400">Information déclarée par le vendeur.</p>
            </div>
          )}
        </div>
      </div>

      {/* Conseils */}
      <div className="bg-[#0A1931] text-white p-5 rounded-2xl space-y-3 text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Conseils pour une annonce convaincante</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          • <strong>Titre foncier :</strong> faites vérifier votre titre de propriété auprès de la Conservation foncière
          pour accélérer la transaction.
        </p>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          • <strong>Accès et commodités :</strong> mentionnez le forage, le groupe électrogène ou la voie bitumée s'ils
          existent : ce sont des critères importants pour les acquéreurs.
        </p>
      </div>
    </div>
  );
}