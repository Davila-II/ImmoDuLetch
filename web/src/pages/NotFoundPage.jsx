import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto my-24 px-4 text-center space-y-4">
      <div className="text-6xl font-black text-[#0A1931]">404</div>
      <h1 className="text-xl font-bold text-slate-900">Page introuvable</h1>
      <p className="text-sm text-slate-500">
        Cette adresse n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="inline-block bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}