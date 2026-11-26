import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import ContactPanel from '../components/property/ContactPanel';
import FavoriteButton from '../components/property/FavoriteButton';
import PropertyGallery from '../components/property/PropertyGallery';
import PropertyHeader from '../components/property/PropertyHeader';
import {
  AmenitiesList,
  LandStatusNotice,
  PropertyDescription,
  PropertyKeyFacts,
} from '../components/property/PropertySections';
import ShareButton from '../components/property/ShareButton';
import { usePropertyDetail } from '../hooks/usePropertyDetail';
import { inquiryService } from '../services/inquiryService';
import { phoneHref, whatsAppLink } from '../utils/contact';
import { formatPrice } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

function PropertyDetail({ reference }) {
  const { t } = useLanguage();
  const { property, similar, loading, notFound, error } = usePropertyDetail(reference);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#0A1931] border-r-transparent" />
        <p className="mt-3 text-slate-500 text-sm font-medium">Chargement...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{notFound ? 'Bien introuvable' : 'Chargement impossible'}</h2>
        <p className="text-slate-500 text-sm">
          {notFound ? "Ce bien n'existe pas ou n'est plus disponible." : error}
        </p>
        <Link
          to="/properties"
          className="inline-block bg-[#0A1931] text-white text-xs font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-slate-800 transition"
        >
          {t('detail.backToResults', null, 'Retour au catalogue')}
        </Link>
      </div>
    );
  }

  const whatsapp = whatsAppLink(property.contact?.phone, property.reference);
  const call = phoneHref(property.contact?.phone);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8 space-y-6 sm:space-y-8">
      {/* Fil d'Ariane & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <Link to="/properties" className="text-slate-500 hover:text-[#0A1931] font-medium flex items-center gap-1 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('detail.backToResults', null, 'Retour aux résultats')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded text-[11px] sm:text-xs">
            {t('detail.reference', null, 'Réf :')} {property.reference}
          </span>
          <ShareButton title={property.title} city={property.city} />
          <FavoriteButton property={property} variant="pill" />
        </div>
      </div>

      <PropertyHeader property={property} />
      <PropertyGallery images={property.images} title={property.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <PropertyKeyFacts property={property} />
          <PropertyDescription description={property.description} />
          <LandStatusNotice status={property.land_status} />
          <AmenitiesList amenities={property.amenities} />
        </div>

        <aside id="contact-section">
          <ContactPanel property={property} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('detail.similarProperties', null, 'Biens similaires dans le secteur')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((item) => (
              <PropertyCard key={item.reference} property={item} />
            ))}
          </div>
        </section>
      )}

      {/* Barre d'action rapide mobile flottante au bas de l'écran */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 font-medium leading-none">{t('detail.certifiedPrice', null, 'Prix certifié')}</div>
          <div className="text-base font-extrabold text-[#0A1931] mt-0.5">{formatPrice(property)}</div>
        </div>

        <div className="flex items-center gap-2">
          {call && (
            <a
              href={call}
              onClick={() => inquiryService.track(property.reference, 'call')}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              aria-label={t('detail.callAgency', null, "Appeler l'agence")}
            >
              <Phone className="w-5 h-5 text-amber-500" />
            </a>
          )}

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => inquiryService.track(property.reference, 'whatsapp')}
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { reference } = useParams();
  return <PropertyDetail key={reference} reference={reference} />;
}
