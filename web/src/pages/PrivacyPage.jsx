import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A1931]">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0A1931] text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>Protection des Données Personnelles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">Politique de Confidentialité</h1>
        <p className="text-xs text-slate-500">Dernière mise à jour : Novembre 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">1. Données collectées</h2>
          <p>
            Dans le cadre de l'utilisation de nos services, nous collectons les données strictement nécessaires au bon
            déroulement de la mise en relation immobilière :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nom complet et prénom</li>
            <li>Numéro de téléphone et contact WhatsApp</li>
            <li>Adresse de courrier électronique (email)</li>
            <li>Informations relatives aux biens déposés (adresses approximatives, photographies, documents fonciers déclarés)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">2. Utilisation et transmission des données</h2>
          <p>
            Vos données personnelles sont utilisées exclusivement pour :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Faciliter la prise de contact entre acquéreurs, locataires et propriétaires ou agences mandatées</li>
            <li>Permettre la transmission des demandes d'estimation et de visite par WhatsApp ou téléphone</li>
            <li>Garantir la sécurité et l'authenticité des comptes créés sur la plateforme</li>
          </ul>
          <p className="font-semibold text-slate-900">
            Nous ne vendons, ne louons et ne cédons aucune donnée personnelle à des fins publicitaires ou à des tiers non autorisés.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">3. Sécurité des informations</h2>
          <p>
            Les communications avec notre API sont sécurisées par chiffrement TLS/HTTPS. Les mots de passe sont hachés
            selon les algorithmes cryptographiques les plus stricts avant stockage en base de données.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">4. Vos droits d'accès et de rectification</h2>
          <p>
            Conformément à la réglementation applicable, vous disposez d'un droit d'accès, de modification et de suppression
            de vos données personnelles. Vous pouvez exercer ce droit à tout moment depuis votre espace membre ou en nous
            adressant une demande par email ou WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}
