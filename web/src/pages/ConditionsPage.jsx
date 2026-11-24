import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A1931]">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </Link>

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0A1931] text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          <span>Cadre Juridique &amp; Foncier</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">Conditions Générales d'Utilisation (CGU)</h1>
        <p className="text-xs text-slate-500">Dernière mise à jour : Novembre 2026 • République du Cameroun</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-slate-700">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">1. Objet de la plateforme</h2>
          <p>
            Immo du Letch est une plateforme numérique de mise en relation immobilière opérant au Cameroun (Douala, Yaoundé,
            Kribi et périphéries). Elle permet la consultation, la publication et la gestion d'annonces de vente, de location
            et de promotion immobilière.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">2. Statut foncier et déclarations des vendeurs</h2>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Avertissement légal : </strong>Les informations relatives à la situation foncière (titre foncier,
            certificat de propriété, certificat d'urbanisme) sont publiées sur la base des déclarations du vendeur ou de l'agence mandatée.
          </div>
          <p>
            Toute transaction définitive doit impérativement faire l'objet des vérifications d'usage auprès de la Conservation
            Foncière compétente et être instrumentée par devant Notaire assermenté conformément à la législation foncière en vigueur
            en République du Cameroun (Décret n° 76-165 du 27 avril 1976 fixant les conditions d'obtention du titre foncier).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">3. Modération des annonces</h2>
          <p>
            Avant publication sur la plateforme, chaque annonce soumise fait l'objet d'un examen de cohérence par l'équipe
            de modération (qualité des photographies, cohérence du prix net vendeur, conformité de la description). L'équipe
            se réserve le droit de refuser, suspendre ou retirer toute annonce comportant des informations inexactes ou litigieuses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">4. Engagements des utilisateurs</h2>
          <p>
            L'utilisateur s'engage à fournir des informations exactes lors de la création de compte et du dépôt d'annonce.
            Il est formellement interdit de publier des photographies appartenant à des tiers sans autorisation préalable
            ou de proposer des biens grevés d'un litige coutumier ou judiciaire non déclaré.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931]">5. Contact &amp; Réclamations</h2>
          <p>
            Pour toute question relative aux présentes conditions ou pour signaler une annonce suspecte, vous pouvez contacter
            notre équipe directement via l'espace membre ou sur WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}
