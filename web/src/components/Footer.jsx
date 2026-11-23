import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/immo.png';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1931] text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 : Logo & Mission */}
          <div className="space-y-4">
            <img src={logo} alt="Immo du Letch" className="h-14 w-auto object-contain bg-white/5 p-1 rounded-lg" />
            <p className="text-sm text-slate-400 leading-relaxed">
              La première marketplace immobilière de prestige et d'investissement sécurisé au Cameroun. Titres fonciers audités, bornages certifiés et accompagnement notarié rigoureux.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-white/5 p-2.5 rounded-lg border border-amber-400/20">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Titres fonciers vérifiés • Notaires agréés Cameroun</span>
            </div>
          </div>

          {/* Col 2 : Acheter & Louer */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2">
              Acheter &amp; Louer
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/properties?category=villa-duplex" className="hover:text-amber-400 transition">Villas &amp; Duplex de prestige</Link></li>
              <li><Link to="/properties?category=appartement-studio" className="hover:text-amber-400 transition">Appartements &amp; Penthouses</Link></li>
              <li><Link to="/properties?category=terrain-titre-parcelle" className="hover:text-amber-400 transition">Terrains titrés &amp; Parcelles viabilisées</Link></li>
              <li><Link to="/properties?category=immeuble-bureau" className="hover:text-amber-400 transition">Immeubles de rapport &amp; Rendement</Link></li>
              <li><Link to="/properties?city=Douala" className="hover:text-amber-400 transition">Biens à Douala (Bonapriso, Bonanjo, Akwa)</Link></li>
              <li><Link to="/properties?city=Yaounde" className="hover:text-amber-400 transition">Biens à Yaoundé (Bastos, Golf)</Link></li>
            </ul>
          </div>

          {/* Col 3 : Services & Outils */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2">
              Services &amp; Outils
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#estimation" className="hover:text-amber-400 transition">Estimation gratuite en ligne</a></li>
              <li><a href="#investissement" className="hover:text-amber-400 transition">Calculateur de rentabilité locative</a></li>
              <li><Link to="/submit" className="hover:text-amber-400 transition">Déposer une annonce propriétaire</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition">Audit foncier &amp; Géomètre assermenté</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Accompagnement Notarié OHADA</a></li>
            </ul>
          </div>

          {/* Col 4 : Contact & Agences */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2">
              Contact &amp; Siège
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>Douala (Bonanjo) &amp; Yaoundé (Bastos), Cameroun</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+237 699 45 28 10</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@immoduletch.cm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} IMMO DU LETCH. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-200">Conditions Générales</a>
            <a href="#" className="hover:text-slate-200">Politique de Confidentialité</a>
            <a href="#" className="hover:text-slate-200">Sécurisation Foncière</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
