import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Building, Key, Home, LandPlot, Store, ArrowRight, ShieldCheck, TrendingUp, CheckCircle, Award } from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import HeroBannerCarousel from '../components/HeroBannerCarousel';

export default function HomePage() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState('sale');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await api.get('/properties?per_page=6');
        setRecentProperties(response.data.data || []);
      } catch (err) {
        console.error('Erreur chargement biens récents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transactionType) params.append('transaction_type', transactionType);
    if (city) params.append('city', city);
    if (category) params.append('category', category);
    if (maxPrice) params.append('max_price', maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16">
      {/* BANNIÈRE HERO MOBILE.DE AVEC CAROUSEL D'IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroBannerCarousel />
      </section>

      {/* SECTION MOTEUR DE RECHERCHE PRINCIPAL */}
      <section className="relative bg-[#0A1931] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-xl">
        {/* Glow & décor de fond */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-semibold backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            <span>N°1 de l'immobilier sécurisé &amp; titres certifiés au Cameroun</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Trouvez le bien idéal avec <span className="text-amber-400">titre foncier vérifié</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Transactions transparentes à Douala, Yaoundé, Kribi et périphéries. Titres audités avec notaires agréés et géomètres assermentés.
          </p>

          {/* SEARCH BOX FORMULAIRE FLOTTANT */}
          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 text-slate-800 shadow-2xl border border-slate-100 max-w-4xl mx-auto text-left">
            {/* Onglets Acheter / Louer */}
            <div className="flex border-b border-slate-200 pb-3 mb-4 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('sale')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
                  transactionType === 'sale'
                    ? 'bg-[#0A1931] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>Acheter</span>
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('rent')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
                  transactionType === 'rent'
                    ? 'bg-[#0A1931] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Louer</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ville / Localisation */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0A1931]"
                  >
                    <option value="">Toutes les villes</option>
                    <option value="Douala">Douala (Bonapriso, Bonanjo, Akwa...)</option>
                    <option value="Yaoundé">Yaoundé (Bastos, Golf, Santa Barbara...)</option>
                    <option value="Kribi">Kribi (Zone Balnéaire)</option>
                  </select>
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Type de bien
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0A1931]"
                  >
                    <option value="">Tous les types</option>
                    <option value="villa-duplex">Villa &amp; Duplex</option>
                    <option value="appartement-studio">Appartement &amp; Studio</option>
                    <option value="terrain-titre">Terrain titré &amp; Parcelle</option>
                    <option value="immeuble-bureau">Immeuble &amp; Bureau</option>
                    <option value="commerce-local">Commerce &amp; Local</option>
                  </select>
                </div>
              </div>

              {/* Budget Max */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Budget max (FCFA)
                </label>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0A1931]"
                >
                  <option value="">Indifférent</option>
                  <option value="50000000">50 000 000 FCFA</option>
                  <option value="100000000">100 000 000 FCFA</option>
                  <option value="200000000">200 000 000 FCFA</option>
                  <option value="350000000">350 000 000 FCFA</option>
                  <option value="500000000">500 000 000 FCFA+</option>
                </select>
              </div>

              {/* Bouton Filtrer */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TYPOLOGIES D'INVESTISSEMENT (Cartes interactives - screen.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Segmentation Patrimoniale</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Typologies d'Investissement</h2>
          </div>
          <Link to="/properties" className="text-sm font-semibold text-[#0A1931] hover:text-amber-600 flex items-center gap-1">
            <span>Explorer tout le catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Duplex & Villas */}
          <Link to="/properties?category=villa-duplex" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-[#0A1931] group-hover:text-amber-400 transition">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Duplex &amp; Villas Standing</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Propriétés de prestige clôturées, piscines, dépendances, forages autonomes à Bastos, Bonapriso, Golf.
            </p>
            <div className="text-xs font-bold text-[#0A1931] flex items-center gap-1">
              <span>Voir les offres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Terrains Titrés */}
          <Link to="/properties?category=terrain-titre" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-[#0A1931] group-hover:text-amber-400 transition">
              <LandPlot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Terrains Titrés &amp; Bornés</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Lots vérifiés au cadastre, bornage contradictoire, vue mer à Kribi ou parcelles viabilisées à Yassa et Odza.
            </p>
            <div className="text-xs font-bold text-[#0A1931] flex items-center gap-1">
              <span>Voir les offres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Immeubles & Appartements */}
          <Link to="/properties?category=appartement-studio" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-[#0A1931] group-hover:text-amber-400 transition">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Immeubles &amp; Appartements</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Monopropriétés locatives R+3/R+4, appartements meublés pour expatriés et résidences à haut rendement.
            </p>
            <div className="text-xs font-bold text-[#0A1931] flex items-center gap-1">
              <span>Voir les offres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Commerces & Bureaux */}
          <Link to="/properties?category=immeuble-bureau" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-[#0A1931] group-hover:text-amber-400 transition">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Commerces &amp; Bureaux</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Plateaux d'affaires à Akwa et Bonanjo, locaux commerciaux en pied d'immeuble et entrepôts logistiques.
            </p>
            <div className="text-xs font-bold text-[#0A1931] flex items-center gap-1">
              <span>Voir les offres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* BIENS RÉCEMMENT PUBLIÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Sélection Certifiée</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Biens Récemment Publiés</h2>
          </div>
          <Link to="/properties" className="text-sm font-semibold text-[#0A1931] hover:text-amber-600 flex items-center gap-1">
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <PropertyCard key={property.reference} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Aucun bien publié pour le moment.</p>
          </div>
        )}
      </section>

      {/* BANNIÈRE ESTIMATION ET VENTE SÉCURISÉE (screen.png) */}
      <section id="estimation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1931] rounded-2xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="space-y-6">
            <span className="bg-amber-400 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full">
              Accompagnement Propriétaire &amp; Vendeur
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Vendez ou estimez votre bien immobilier au Cameroun
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Bénéficiez d'une vérification rigoureuse dans toutes les démarches foncières et notariales : audit du titre foncier, certificat de propriété, bornage contradictoire et sécurisation des fonds.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-xs text-slate-400">Titres Fonciers audités</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">35 j</div>
                <div className="text-xs text-slate-400">Délai moyen de vente certifiée</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">2 800+</div>
                <div className="text-xs text-slate-400">Acquéreurs solvables &amp; Diaspora</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-slate-800 shadow-lg">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Estimation Gratuite &amp; Confidentielle</h3>
            <p className="text-xs text-slate-500 mb-4">Sans engagement • Expertise Cadastrale</p>
            
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Demande d'estimation enregistrée ! Nos experts vous contacteront."); }}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Localisation du bien</label>
                <input 
                  type="text" 
                  placeholder="Ex : Douala, Bonapriso" 
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Type d'actif</label>
                  <select className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
                    <option>Villa / Duplex</option>
                    <option>Terrain titré</option>
                    <option>Appartement</option>
                    <option>Immeuble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Superficie (m²)</label>
                  <input 
                    type="number" 
                    placeholder="Ex : 500" 
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50" 
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 rounded-lg text-sm transition mt-2"
              >
                Estimer mon bien au Cameroun →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
