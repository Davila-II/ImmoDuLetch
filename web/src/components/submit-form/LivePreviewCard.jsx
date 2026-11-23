import React from 'react';
import { ShieldCheck, MapPin, BedDouble, Bath, Maximize2, CheckCircle2, Lock } from 'lucide-react';

export default function LivePreviewCard({ formData, images }) {
  const formattedPrice = formData.price 
    ? new Intl.NumberFormat('fr-FR').format(formData.price) + ' FCFA'
    : 'Prix non défini';

  const previewImage = images && images.length > 0
    ? (images[0].url || (images[0].file ? URL.createObjectURL(images[0].file) : null))
    : null;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Titre aperçu */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Aperçu en direct de l'annonce
        </span>
        <span className="text-slate-400">Mode Acquéreur</span>
      </div>

      {/* CARD DE L'ANNONCE EN DIRECT */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition">
        {/* Photo Vitrine */}
        <div className="relative aspect-16/10 bg-slate-900 overflow-hidden flex items-center justify-center">
          {previewImage ? (
            <img src={previewImage} alt="Aperçu" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-slate-500 text-xs p-4">
              <span>Aucune photo chargée</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-[#0A1931] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {formData.transaction_type === 'sale' ? 'Vente' : 'Location'}
            </span>
            <span className="bg-[#F5A623] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Exclusivité Letch
            </span>
          </div>

          {images && images.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
              {images.length} photo{images.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Détails Carte */}
        <div className="p-5 space-y-3">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {formData.city || 'Ville'} • {formData.neighborhood || 'Quartier'}
          </div>

          <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
            {formData.title || "Titre de votre bien d'exception..."}
          </h3>

          <div className="text-2xl font-black text-[#0A1931]">
            {formattedPrice}
          </div>

          {/* Grille métrique */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">{formData.built_area || '-'} m²</div>
              <div className="text-[10px] text-slate-400">Surface bâtie</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{formData.bedrooms || '-'}</div>
              <div className="text-[10px] text-slate-400">Chambres</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{formData.land_area || '-'} m²</div>
              <div className="text-[10px] text-slate-400">Terrain titré</div>
            </div>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Titre Foncier audité par notaire</span>
            </span>
          </div>
        </div>
      </div>

      {/* CONSEILS DE NOS EXPERTS FONCIERS (comme screen (5).png) */}
      <div className="bg-[#0A1931] text-white p-5 rounded-2xl space-y-3 text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Conseils de nos Experts Fonciers</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          • <strong>Titre Foncier certifié :</strong> Faites vérifier votre titre de propriété auprès de la Conservation Foncière (Livre Foncier) pour accélérer le closing.
        </p>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          • <strong>Accès &amp; Commodités :</strong> Mentionnez la présence d'un forage autonome, groupe électrogène ou voie bitumée pour justifier le positionnement haut de gamme.
        </p>
      </div>
    </div>
  );
}
