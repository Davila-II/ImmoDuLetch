import { Link } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';

function accountLabel(user) {
  if (user?.account_type === 'agence') return user.agency?.is_certified ? 'Agence certifiée' : 'Compte agence';
  return user?.account_type === 'independant' ? 'Indépendant' : 'Particulier';
}

export default function ProfileHeader({ user, onLogout }) {
  return (
    <div className="bg-[#0A1931] text-white p-5 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ID'}
        </div>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-extrabold truncate">{user?.name}</h1>
            <span className="bg-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-300/30">
              {accountLabel(user)}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 truncate">
            {user?.email} • {user?.phone || 'Téléphone non renseigné'}
          </p>
          {user?.agency?.name && <p className="text-xs text-slate-400 mt-0.5 truncate">{user.agency.name}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
        <Link
          to="/deposer"
          className="flex-1 md:flex-initial justify-center bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Déposer une annonce</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
