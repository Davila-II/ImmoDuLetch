import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, CheckCircle2, ShieldCheck, Heart, Share2, 
  BedDouble, Bath, Maximize2, Calendar, Phone, MessageSquare, 
  Check, ArrowLeft, Building2, UserCheck
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function PropertyDetailPage() {
  const { reference } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Formulaire de contact / visite
  const [inquiryType, setInquiryType] = useState('contact');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [propRes, simRes] = await Promise.all([
          api.get(`/properties/${reference}`),
          api.get(`/properties/${reference}/similar`).catch(() => ({ data: [] }))
        ]);
        setProperty(propRes.data);
        setSimilarProperties(simRes.data || []);
      } catch (err) {
        console.error('Erreur chargement détail bien', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [reference]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    try {
      await api.post(`/properties/${reference}/inquiries`, {
        type: inquiryType,
        name,
        phone,
        email,
        message,
        preferred_date: inquiryType === 'visit' ? preferredDate : undefined,
      });
      setInquirySuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Erreur envoi demande', err);
      alert("Une erreur est survenue lors de l'envoi de votre demande.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0A1931] border-r-transparent"></div>
        <p className="mt-3 text-slate-500 text-sm">Chargement du bien certifié...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Bien introuvable</h2>
        <p className="text-slate-500 text-sm">Ce bien n'existe pas ou n'est plus disponible sur notre plateforme.</p>
        <Link to="/properties" className="inline-block bg-[#0A1931] text-white text-xs font-semibold py-2 px-4 rounded-lg">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(property.price) + ' FCFA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Fil d'Ariane & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link to="/properties" className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux résultats</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">Réf : {property.reference}</span>
        </div>
      </div>

      {/* Titre & Localisation & Prix */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#0A1931] text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
              {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
            </span>
            {property.is_exclusive && (
              <span className="bg-[#F5A623] text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                Exclusivité Letch
              </span>
            )}
            <span className="text-xs text-slate-400">• Publié &amp; Certifié</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931]">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{property.city} — {property.neighborhood || 'Quartier résidentiel'}</span>
          </div>
        </div>

        <div className="text-left lg:text-right">
          <div className="text-2xl sm:text-3xl font-black text-[#0A1931]">
            {formattedPrice}
          </div>
          {property.price_per_sqm && (
            <div className="text-xs text-slate-500 font-semibold">
              {new Intl.NumberFormat('fr-FR').format(property.price_per_sqm)} FCFA / m²
            </div>
          )}
        </div>
      </div>

      {/* GALERIE PHOTOS (Style screen (12).png) */}
      <div className="space-y-3">
        <div className="relative aspect-16/9 md:aspect-21/9 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
          <img 
            src={images[selectedImage]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-14 sm:w-28 sm:h-18 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                  selectedImage === idx ? 'border-[#F5A623] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CORPS : INFOS DU BIEN (Gauche 2/3) + FORMULAIRE DE CONTACT (Droite 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* CARACTÉRISTIQUES CLÉS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 text-center">
            {property.built_area && (
              <div>
                <span className="block text-xl font-extrabold text-[#0A1931]">{property.built_area} m²</span>
                <span className="text-xs text-slate-500 font-medium">Surface bâtie</span>
              </div>
            )}
            {property.land_area && (
              <div>
                <span className="block text-xl font-extrabold text-[#0A1931]">{property.land_area} m²</span>
                <span className="text-xs text-slate-500 font-medium">Terrain titré</span>
              </div>
            )}
            {property.bedrooms !== null && (
              <div>
                <span className="block text-xl font-extrabold text-[#0A1931]">{property.bedrooms}</span>
                <span className="text-xs text-slate-500 font-medium">Chambres</span>
              </div>
            )}
            {property.bathrooms !== null && (
              <div>
                <span className="block text-xl font-extrabold text-[#0A1931]">{property.bathrooms}</span>
                <span className="text-xs text-slate-500 font-medium">Salles d'eau</span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Description du bien
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description || "Aucune description détaillée renseignée."}
            </p>
          </div>

          {/* SÉCURITÉ FONCIÈRE ET CADASTRE (Élément phare Immo du Letch) */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Transparence Foncière &amp; Statut Cadastral</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Statut déclaré : <strong>{property.land_status_label || property.land_status}</strong>.
              Nos équipes et nos notaires partenaires effectuent la vérification systématique au livre foncier avant signature du compromis de vente ou du bail.
            </p>
          </div>

          {/* ÉQUIPEMENTS & PRESTATIONS */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Équipements &amp; Prestations
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : CONTACT & PRISE DE RENDEZ-VOUS (Style screen (12).png) */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Contact Direct</span>
              <h3 className="text-lg font-extrabold text-[#0A1931]">Contacter pour ce bien</h3>
              <p className="text-xs text-slate-500">Réf : {property.reference}</p>
            </div>

            {/* Boutons d'action rapides */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/237699452810?text=Bonjour,%20je%20suis%20intéressé%20par%20votre%20bien%20réf%20${property.reference}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-xs transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp (+237 699 45 28 10)</span>
              </a>

              <a
                href="tel:+237699452810"
                className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Appeler l'agence</span>
              </a>
            </div>

            {/* Formulaire Prise de rendez-vous / Visite */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 mb-3">Planifier un échange ou une visite</h4>
              
              {inquirySuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-medium border border-emerald-200">
                  Votre demande a bien été envoyée à notre équipe !
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryType('contact')}
                      className={`flex-1 py-1.5 rounded font-medium border ${
                        inquiryType === 'contact' ? 'bg-[#0A1931] text-white border-[#0A1931]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('visit')}
                      className={`flex-1 py-1.5 rounded font-medium border ${
                        inquiryType === 'visit' ? 'bg-[#0A1931] text-white border-[#0A1931]' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Demander visite
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />
                  <input
                    type="tel"
                    placeholder="Votre numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  />

                  {inquiryType === 'visit' && (
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Date souhaitée :</label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        required
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  )}

                  <textarea
                    rows="3"
                    placeholder="Votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2 rounded-lg text-xs transition"
                  >
                    {submittingInquiry ? "Envoi..." : "Envoyer ma demande"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* BIENS SIMILAIRES */}
      {similarProperties.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Biens Similaires dans le Secteur</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((sim) => (
              <PropertyCard key={sim.reference} property={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
