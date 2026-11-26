import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, Menu, PlusCircle, ShieldCheck, User, X } from 'lucide-react';
import logo from '../assets/immo.png';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './ui/LanguageSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/properties?transaction_type=sale', label: t('nav.buy') },
    { to: '/properties?transaction_type=rent', label: t('nav.rent') },
    { to: '/properties', label: t('nav.allProperties') },
    { to: '/#estimation', label: t('nav.estimation') },
  ];

  // Fermer automatiquement le menu mobile lors d'un changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Empêcher le scroll du body quand le menu mobile plein écran est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top banner info */}
      <div className="bg-[#0A1931] text-[11px] sm:text-xs text-slate-300 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('nav.bannerHighlight')}
            </span>
            <span className="hidden lg:inline">• {t('nav.bannerPoint1')}</span>
            <span className="hidden lg:inline">• {t('nav.bannerPoint2')}</span>
          </div>
          <span className="text-slate-400">{t('nav.bannerCities')}</span>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo officiel */}
          <Link to="/" className="flex items-center gap-2 shrink-0 py-2" onClick={closeMenu}>
            <img src={logo} alt="Immo du Letch" className="h-10 sm:h-14 w-auto object-contain" />
          </Link>

          {/* Liens Desktop */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-medium text-slate-700 text-sm">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-[#0A1931] transition">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Sélecteur de Langue Desktop */}
            <div className="hidden sm:block">
              <LanguageSwitcher variant="navbar" />
            </div>

            {/* Bouton Favoris */}
            <Link
              to="/favorites"
              className="p-2 sm:p-2.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-full transition"
              title={t('nav.favorites')}
              aria-label={t('nav.favorites')}
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Espace Compte */}
            <Link
              to={user ? '/my-account' : '/login'}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{user ? user.name?.split(' ')[0] : t('nav.myAccount')}</span>
            </Link>

            {/* Bouton Déposer une annonce */}
            <Link
              to="/deposer"
              className="flex items-center gap-1.5 sm:gap-2 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline sm:inline">{t('nav.deposit')}</span>
            </Link>

            {/* Hamburger menu mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Drawer Mobile */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col justify-between">
          <nav className="bg-white border-t border-slate-200 px-5 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl">
            {/* Sélecteur de langue mobile */}
            <LanguageSwitcher variant="drawer" />

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                Navigation
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition"
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>{t('nav.adminPanel')}</span>
                </Link>
              )}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                {t('nav.mySpace')}
              </span>

              <Link
                to="/favorites"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>{t('nav.favorites')}</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/my-account"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <User className="w-5 h-5 text-slate-500" />
                    <span>{t('nav.dashboard')} ({user.name})</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                  >
                    <LogOut className="w-5 h-5 text-rose-500" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-center py-2.5 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center py-2.5 px-3 rounded-xl bg-[#0A1931] text-white font-bold text-xs hover:bg-slate-800"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            <div>
              <Link
                to="/deposer"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-3 px-4 rounded-xl text-sm shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('nav.deposit')}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
