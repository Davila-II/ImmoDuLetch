import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Type d’opération' },
  { id: 2, label: 'Caractéristiques du bien' },
  { id: 3, label: 'Médias & Visite 3D' },
  { id: 4, label: 'Prix & Mise en ligne' },
];

export default function StepperHeader({ currentStep, reference, isSaving }) {
  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 mb-8 sticky top-20 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Titre & Ref */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 uppercase tracking-wider">MANDAT EXCLUSIF &amp; LIBRE</span>
            <span>• Portail Vendeur Certifié</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1931]">
            Déposer une Annonce Immobilière — Cameroun
          </h1>
        </div>

        {/* Statut Sauvegarde / Synchro */}
        {reference && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="font-mono font-semibold">Réf : {reference}</span>
            <span className="text-emerald-600">• {isSaving ? 'Enregistrement...' : 'Brouillon synchronisé'}</span>
          </div>
        )}
      </div>

      {/* Stepper visual bar */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s) => {
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;

            return (
              <div 
                key={s.id} 
                className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  isCurrent 
                    ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-sm' 
                    : isDone 
                      ? 'bg-amber-50/60 text-slate-800 border-amber-300' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCurrent 
                    ? 'bg-amber-400 text-slate-950' 
                    : isDone 
                      ? 'bg-amber-400 text-slate-950' 
                      : 'bg-slate-200 text-slate-600'
                }`}>
                  {isDone ? <Check className="w-4 h-4 stroke-3" /> : s.id}
                </div>
                <div className="overflow-hidden">
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                    Étape {s.id} {isCurrent && '— En cours'}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
