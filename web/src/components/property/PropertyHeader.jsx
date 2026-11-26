import { MapPin } from 'lucide-react';
import { formatNumber, formatPrice } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';

export default function PropertyHeader({ property }) {
  const { t } = useLanguage();
  const isRent = property.transaction_type === 'rent';

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-[#0A1931] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
            {isRent ? t('card.rent', null, 'Location') : t('card.sale', null, 'Vente')}
          </span>
          {property.is_exclusive && (
            <span className="bg-[#F5A623] text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
              {t('card.exclusive', null, 'Exclusivité Letch')}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931]">{property.title}</h1>
        <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {property.city} — {property.neighborhood || 'Quartier résidentiel'}
          </span>
        </div>
      </div>

      <div className="text-left lg:text-right">
        <div className="text-2xl sm:text-3xl font-black text-[#0A1931]">{formatPrice(property)}</div>
        {!isRent && property.price_per_sqm && (
          <div className="text-xs text-slate-500 font-semibold mt-0.5">
            {formatNumber(property.price_per_sqm)} {t('detail.pricePerSqm', null, 'FCFA / m²')}
          </div>
        )}
      </div>
    </div>
  );
}