import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

function PropertyDetail({ reference }) {
  const { property, similar, loading, notFound, error } = usePropertyDetail(reference);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#0A1931] border-r-transparent" />
        <p className="mt-3 text-slate-500 text-sm font-medium">Chargement du bien...</p>
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
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link to="/properties" className="text-slate-500 hover:text-[#0A1931] font-medium flex items-center gap-1 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux résultats</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded text-xs">
            Réf : {property.reference}
          </span>
          <ShareButton title={property.title} city={property.city} />
          <FavoriteButton property={property} variant="pill" />
        </div>
      </div>

      <PropertyHeader property={property} />
      <PropertyGallery images={property.images} title={property.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PropertyKeyFacts property={property} />
          <PropertyDescription description={property.description} />
          <LandStatusNotice status={property.land_status} />
          <AmenitiesList amenities={property.amenities} />
        </div>

        <aside>
          <ContactPanel property={property} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Biens similaires dans le secteur</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((item) => (
              <PropertyCard key={item.reference} property={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// « key » : changer de bien recrée le composant, donc l'état repart proprement
export default function PropertyDetailPage() {
  const { reference } = useParams();
  return <PropertyDetail key={reference} reference={reference} />;
}