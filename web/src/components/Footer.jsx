import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/immo.png';
import { CITY_OPTIONS } from '../constants/cities';
import { COMPANY } from '../constants/company';
import { LEGAL_LINKS } from '../constants/legal';
import { PROPERTY_TYPE_CARDS } from '../constants/siteContent';
import { phoneHref } from '../utils/contact';

const linkClass = 'hover:text-amber-400 transition';
const headingClass = 'text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2';

export default function Footer() {
  const hasContact = COMPANY.phone || COMPANY.email || COMPANY.address;

  return (
    <footer className="bg-[#0A1931] text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <img src={logo} alt={COMPANY.name} className="h-14 w-auto object-contain bg-white/5 p-1 rounded-lg" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Plateforme immobilière au Cameroun : trouvez, publiez et gérez vos annonces de vente et de location à
              Douala, Yaoundé et Kribi.
            </p>
          </div>

          <div>
            <h4 className={headingClass}>Acheter &amp; louer</h4>
            <ul className="space-y-2.5 text-sm">
              {PROPERTY_TYPE_CARDS.map((card) => (
                <li key={card.slug}>
                  <Link to={`/properties?category=${card.slug}`} className={linkClass}>
                    {card.title}
                  </Link>
                </li>
              ))}
              {CITY_OPTIONS.map((city) => (
                <li key={city.value}>
                  <Link to={`/properties?city=${encodeURIComponent(city.value)}`} className={linkClass}>
                    Biens à {city.value}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#estimation" className={linkClass}>
                  Demander une estimation
                </Link>
              </li>
              <li>
                <Link to="/deposer" className={linkClass}>
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link to="/my-account" className={linkClass}>
                  Mon espace
                </Link>
              </li>
              <li>
                <Link to="/favorites" className={linkClass}>
                  Mes favoris
                </Link>
              </li>
            </ul>
          </div>

          {hasContact && (
            <div>
              <h4 className={headingClass}>Contact</h4>
              <ul className="space-y-3 text-sm">
                {COMPANY.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <span>{COMPANY.address}</span>
                  </li>
                )}
                {COMPANY.phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={phoneHref(COMPANY.phone)} className={linkClass}>
                      {COMPANY.phone}
                    </a>
                  </li>
                )}
                {COMPANY.email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={`mailto:${COMPANY.email}`} className={linkClass}>
                      {COMPANY.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </p>

          {LEGAL_LINKS.length > 0 && (
            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-slate-200">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}