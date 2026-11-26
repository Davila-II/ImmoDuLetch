import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { getLandStatusLabel } from '../../constants/landStatus';
import { useLanguage } from '../../context/LanguageContext';

export function PropertyKeyFacts({ property }) {
  const { t } = useLanguage();

  const facts = [
    { label: t('detail.builtArea', null, 'Surface bâtie'), value: property.built_area, unit: ' m²' },
    { label: t('detail.landArea', null, 'Terrain'), value: property.land_area, unit: ' m²' },
    { label: t('detail.bedrooms', null, 'Chambres'), value: property.bedrooms, unit: '' },
    { label: t('detail.bathrooms', null, "Salles d'eau"), value: property.bathrooms, unit: '' },
  ].filter((fact) => fact.value !== null && fact.value !== undefined);

  if (facts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 text-center">
      {facts.map((fact) => (
        <div key={fact.label}>
          <span className="block text-xl font-extrabold text-[#0A1931]">
            {fact.value}
            {fact.unit}
          </span>
          <span className="text-xs text-slate-500 font-medium">{fact.label}</span>
        </div>
      ))}
    </div>
  );
}

export function PropertyDescription({ description }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{t('detail.descriptionTitle', null, 'Description du bien')}</h2>
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
        {description || t('detail.noDescription', null, 'Aucune description détaillée renseignée.')}
      </p>
    </div>
  );
}

export function LandStatusNotice({ status }) {
  const { t } = useLanguage();
  const label = getLandStatusLabel(status);
  if (!label) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-2">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
        <ShieldCheck className="w-5 h-5 text-slate-500" />
        <span>{t('detail.landDeclared', null, 'Statut foncier déclaré')}</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        <strong>{label}</strong>. {t('detail.landLegalNotice', null, 'Cette information est fournie par le vendeur. Une vérification auprès de la Conservation foncière est recommandée avant toute transaction.')}
      </p>
    </div>
  );
}

export function AmenitiesList({ amenities = [] }) {
  const { t } = useLanguage();
  if (amenities.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{t('detail.amenitiesTitle', null, 'Équipements & prestations')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}