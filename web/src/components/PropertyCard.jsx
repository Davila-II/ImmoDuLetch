import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { getLandStatusLabel } from '../constants/landStatus';
import { inquiryService } from '../services/inquiryService';
import { whatsAppLink } from '../utils/contact';
import { formatNumber, formatPrice } from '../utils/format';
import FavoriteButton from './property/FavoriteButton';
import { useLanguage } from '../context/LanguageContext';

function Metric({ value, label }) {
  if (value === null || value === undefined) return <div />;

  return (
    <div className="flex flex-col items-center">
      <span className="font-semibold text-slate-800">{value}</span>
      <span className="text-[10px] text-slate-600">{label}</span>
    </div>
  );
}

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { t } = useLanguage();
  const isRent = property.transaction_type === 'rent';
  const mainImage = property.images?.find((img) => img.is_primary)?.url ?? property.images?.[0]?.url ?? null;
  const photosCount = property.photos_count ?? property.images?.length ?? 0;
  const landStatusLabel = getLandStatusLabel(property.land_status);
  const whatsappUrl = whatsAppLink(property.contact?.phone, property.reference);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Photo à venir</div>
          )}

          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap gap-1.5 items-center">
            <span className="bg-[#0A1931] text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded uppercase tracking-wider">
              {isRent ? t('card.rent') : t('card.sale')}
            </span>
            {property.is_exclusive && (
              <span className="bg-[#F5A623] text-slate-950 text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded uppercase">
                {t('card.exclusive')}
              </span>
            )}
          </div>

          <FavoriteButton
            property={property}
            onChange={onFavoriteToggle}
            className="absolute top-2.5 sm:top-3 right-2.5 sm:top-3"
          />

          {photosCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-slate-900/75 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium backdrop-blur-xs">
              {photosCount} {t('card.photos')}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-2">
            <div className="text-lg sm:text-xl font-bold text-[#0A1931]">{formatPrice(property)}</div>
            {!isRent && property.price_per_sqm && (
              <div className="text-xs text-slate-500 font-medium">{formatNumber(property.price_per_sqm)} FCFA/m²</div>
            )}
          </div>

          {landStatusLabel && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 text-[11px] px-2 py-0.5 rounded font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                {landStatusLabel}
              </span>
            </div>
          )}

          <Link to={`/properties/${property.reference}`}>
            <h3
              className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1 hover:text-amber-600 transition"
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
            <Metric value={property.built_area ? `${property.built_area} m²` : null} label={t('card.built')} />
            <Metric value={property.bedrooms !== null ? `${property.bedrooms} ch.` : null} label={t('card.bedrooms')} />
            <Metric value={property.land_area ? `${property.land_area} m²` : null} label={t('card.land')} />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/properties/${property.reference}`}
            className="flex-1 text-center bg-slate-100 hover:bg-[#0A1931] hover:text-white text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition"
          >
            {t('card.viewDetails')}
          </Link>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => inquiryService.track(property.reference, 'whatsapp')}
              className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 px-3.5 rounded-xl transition shadow-xs"
              title="Contacter sur WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('card.whatsapp')}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
