import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, PlusCircle, User, X } from 'lucide-react';
import logo from '../assets/immo.png';
import { NAV_LINKS } from '../constants/navigation';
import { TOP_BANNER } from '../constants/siteContent';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="bg-[#0A1931] text-xs text-slate-300 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {TOP_BANNER.highlight}
            </span>
            {TOP_BANNER.points.map((point) => (
              <span key={point}>• {point}</span>
            ))}
          </div>
          <span className="text-slate-400">{TOP_BANNER.cities}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <img src={logo} alt="Immo du Letch" className="h-14 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-slate-700 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-[#0A1931] transition">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/favorites"
              className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-full transition"
              title="Mes favoris"
              aria-label="Mes favoris"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              to={user ? '/my-account' : '/login'}
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{user ? user.name?.split(' ')[0] : 'Mon espace'}</span>
            </Link>

            <Link
              to="/deposer"
              className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Déposer une annonce</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Menu"
              className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={closeMenu}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}