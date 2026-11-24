import { AlertTriangle, Building, CheckCircle, Clock, Users, ShieldCheck } from 'lucide-react';
import { formatNumber } from '../../utils/format';

export default function AdminStatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'En attente de modération',
      value: stats.pending_properties ?? 0,
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      highlight: (stats.pending_properties ?? 0) > 0,
    },
    {
      label: 'Annonces publiées',
      value: stats.published_properties ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Annonces refusées / suspendues',
      value: (stats.rejected_properties ?? 0) + (stats.suspended_properties ?? 0),
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      label: 'Agences certifiées',
      value: `${stats.certified_agencies ?? 0} / ${stats.total_agencies ?? 0}`,
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Utilisateurs inscrits',
      value: formatNumber(stats.total_users ?? 0),
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`p-4 sm:p-5 bg-white rounded-2xl border ${
              card.highlight ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-sm' : 'border-slate-200'
            } shadow-xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0A1931] mt-1">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
