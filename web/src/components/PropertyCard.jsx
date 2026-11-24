import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, MessageSquare } from 'lucide-react';
import { useFavoriteToggle } from '../hooks/useFavoriteToggle';
import { trackContact, whatsAppLink } from '../utils/contact';
import LoginPromptToast from './LoginPromptToast';

// Les statuts fonciers sont toujours présentés comme déclarés par le vendeur :
// la plateforme ne les a pas vérifiés elle-même.
const LAND_STATUS_BADGES = {
  title_available: 'Titre foncier déclaré',
  document_verified: 'Document déclaré vérifié',
  document_unverified: 'Document non vérifié',
  to_verify: 'Audit recommandé',
};

const format = (n) => new Intl.NumberFormat('fr-FR').format(n);

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { isFav, loadingFav, showLoginHint, toggle, dismissHint } = useFavoriteToggle(property);

  const isRent = property.transaction_type === 'rent';
  const formattedPrice = property.price
    ? `${format(property.price)} FCFA${isRent ? ' / mois' : ''}`
    : 'Prix non défini';

  const mainImage =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.is_primary)?.url || property.images[0].url
      : null;

  const photosCount = property.photos_count ?? property.images?.length ?? 0;
  const landStatusLabel = LAND_STATUS_BADGES[property.land_status];
  const whatsappUrl = whatsAppLink(property.contact?.phone, property.reference);

  const handleToggle = async (e) => {
    await toggle(e);
    if (onFavoriteToggle) onFavoriteToggle(property.reference, !isFav);
  };

  return (
    <>
      {showLoginHint && <LoginPromptToast onClose={dismissHint} />}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
        {/* Photo */}
        <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
              Photo à venir
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="bg-[#0A1931] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {isRent ? 'Location' : 'Vente'}
            </span>
            {property.is_exclusive && (
              <span className="bg-[#F5A623] text-slate-950 text-xs font-bold px-2 py-1 rounded uppercase">
                Exclusivité Letch
              </span>
            )}
          </div>

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

          {photosCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-xs px-2 py-0.5 rounded font-medium">
              {photosCount} photo{photosCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <div className="text-xl font-bold text-[#0A1931]">{formattedPrice}</div>
              {/* Le prix au m² n'a de sens que pour une vente */}
              {!isRent && property.price_per_sqm && (
                <div className="text-xs text-slate-500 font-medium">{format(property.price_per_sqm)} FCFA/m²</div>
              )}
            </div>

            {landStatusLabel && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded font-medium">
                  <ShieldCheck className="w-3 h-3 text-slate-500" />
                  {landStatusLabel}
                </span>
              </div>
            )}

            <Link to={`/properties/${property.reference}`}>
              <h3
                className="font-semibold text-slate-800 text-base line-clamp-1 hover:text-amber-600 transition"
                title={property.title}
              >
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {property.city} — {property.neighborhood || 'Quartier résidentiel'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-slate-100 text-slate-600 text-xs text-center">
              {property.built_area ? (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">{property.built_area} m²</span>
                  <span className="text-[10px] text-slate-600">Bâti</span>
                </div>
              ) : (
                <div />
              )}
              {property.bedrooms !== null && property.bedrooms !== undefined ? (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">{property.bedrooms} ch.</span>
                  <span className="text-[10px] text-slate-600">Chambres</span>
                </div>
              ) : (
                <div />
              )}
              {property.land_area ? (
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-slate-800">{property.land_area} m²</span>
                  <span className="text-[10px] text-slate-600">Terrain</span>
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center justify-between gap-2">
            <Link
              to={`/properties/${property.reference}`}
              className="flex-1 text-center bg-slate-100 hover:bg-[#0A1931] hover:text-white text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg transition"
            >
              Voir la fiche
            </Link>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact(property.reference, 'whatsapp')}
                className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-xs"
                title="Contacter sur WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}