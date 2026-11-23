import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, PlusCircle, Search, ShieldCheck } from 'lucide-react';
import logo from '../assets/immo.png';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Banner / Gage de confiance (style mobile.de / portail certifié) */}
      <div className="bg-[#0A1931] text-xs text-slate-300 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Plateforme Immobilière Certifiée
            </span>
            <span>• Titres Fonciers vérifiés &amp; Bornages certifiés</span>
            <span>• Sécurisation Notariale</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Douala • Yaoundé • Kribi</span>
            <span className="text-slate-600">|</span>
            </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Immo du Letch" className="h-14 w-auto object-contain" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-slate-700 text-sm">
            <Link to="/" className="hover:text-[#0A1931] transition">Accueil</Link>
            <Link to="/properties?transaction_type=sale" className="hover:text-[#0A1931] transition">Acheter</Link>
            <Link to="/properties?transaction_type=rent" className="hover:text-[#0A1931] transition">Louer</Link>
            <Link to="/properties" className="hover:text-[#0A1931] transition">Tous les biens</Link>
            <a href="#estimation" className="hover:text-[#0A1931] transition">Estimation</a>
            <a href="#investissement" className="hover:text-[#0A1931] transition">Investissement</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/favorites"
              className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-full transition relative"
              title="Mes Favoris"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              to={user ? "/my-account" : "/login"}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{user ? user.name?.split(' ')[0] : 'Mon Espace'}</span>
            </Link>

            <Link
              to="/deposer"
              className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Déposer une annonce</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
