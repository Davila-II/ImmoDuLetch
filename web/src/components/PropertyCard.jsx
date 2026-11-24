import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { useFavoriteToggle } from '../hooks/useFavoriteToggle';
import LoginPromptToast from './LoginPromptToast';

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { isFav, loadingFav, showLoginHint, toggle, dismissHint } =
    useFavoriteToggle(property);

  // Prix formaté en FCFA
  const formattedPrice =
    new Intl.NumberFormat('fr-FR').format(property.price) + ' FCFA';

  // Image principale (fallback Unsplash si aucune image)
  const mainImage =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.is_primary)?.url ||
        property.images[0].url
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  // Callback parent après bascule réussie
  const handleToggle = async (e) => {
    await toggle(e);
    if (onFavoriteToggle) onFavoriteToggle(property.reference, !isFav);
  };

  const getLandStatusBadge = (status) => {
    switch (status) {
      case 'titre_disponible':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Titre Foncier Vérifié
          </span>
        );
      case 'verifie_professionnel':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded font-medium">
            Vérifié Notaire / Géomètre
          </span>
        );
      case 'en_cours':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded font-medium">
            Mutation en cours
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded font-medium">
            Audit recommandé
          </span>
        );
    }
  };

  return (
    <>
      {/* Toast connexion requis */}
      {showLoginHint && <LoginPromptToast onClose={dismissHint} />}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
        {/* Vignette image */}
        <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="bg-[#0A1931] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
            </span>
            {property.is_exclusive && (
              <span className="bg-[#F5A623] text-slate-950 text-xs font-bold px-2 py-1 rounded uppercase">
                Exclusivité Letch
              </span>
            )}
          </div>

          {/* Bouton Favori */}
          <button
            onClick={handleToggle}
            disabled={loadingFav}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
              isFav
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Compteur photos */}
          {property.images && property.images.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-xs px-2 py-0.5 rounded font-medium backdrop-blur-xs">
              {property.images.length} photos
            </div>
          )}
        </div>

        {/* Contenu carte */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Prix & statut foncier */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="text-xl font-bold text-[#0A1931]">
                  {formattedPrice}
                </div>
                {property.price_per_sqm && (
                  <div className="text-xs text-slate-500 font-medium">
                    {new Intl.NumberFormat('fr-FR').format(
                      property.price_per_sqm,
                    )}{' '}
                    FCFA/m²
                  </div>
                )}
              </div>
            </div>

            <div className="mb-2">{getLandStatusBadge(property.land_status)}</div>

            {/* Titre */}
            <Link to={`/properties/${property.reference}`}>
              <h3
                className="font-semibold text-slate-800 text-base line-clamp-1 hover:text-amber-600 transition"
                title={property.title}
              >
                {property.title}
              </h3>
            </Link>

            {/* Localisation */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {property.city} — {property.neighborhood || 'Quartier résidentiel'}
              </span>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-100 text-slate-600 text-xs text-center">
              {property.built_area && (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">
                    {property.built_area} m²
                  </span>
                  <span className="text-[10px] text-slate-600">Bâti</span>
                </div>
              )}
              {property.bedrooms !== null && (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">
                    {property.bedrooms} ch.
                  </span>
                  <span className="text-[10px] text-slate-600">Chambres</span>
                </div>
              )}
              {property.land_area && (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">
                    {property.land_area} m²
                  </span>
                  <span className="text-[10px] text-slate-600">Terrain</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-4 pt-2 flex items-center justify-between gap-2">
            <Link
              to={`/properties/${property.reference}`}
              className="flex-1 text-center bg-slate-100 hover:bg-[#0A1931] hover:text-white text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg transition"
            >
              Voir la fiche
            </Link>

            <a
              href={`https://wa.me/237699452810?text=Bonjour,%20je%20suis%20intéressé%20par%20votre%20bien%20réf%20${property.reference}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-xs"
              title="Contacter sur WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
