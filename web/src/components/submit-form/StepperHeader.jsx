import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Type de bien' },
  { id: 2, label: 'Caractéristiques' },
  { id: 3, label: 'Photos' },
  { id: 4, label: 'Prix & envoi' },
];

export default function StepperHeader({ currentStep, reference, isSaving }) {
  const currentStepObj = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 mb-6 sm:mb-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Espace vendeur</p>
          <h1 className="text-lg sm:text-2xl font-black text-[#0A1931]">Déposer une annonce immobilière</h1>
        </div>

        {reference && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 self-start md:self-auto">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="font-mono font-semibold">Réf : {reference}</span>
            <span className="text-emerald-600">• {isSaving ? 'Enregistrement...' : 'Brouillon enregistré'}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-4 sm:mt-6">
        {/* Vue compacte Mobile (< sm) */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0A1931]">
              Étape {currentStep}/4 : <span className="text-amber-600">{currentStepObj.label}</span>
            </span>
            <div className="flex gap-1.5">
              {STEPS.map((step) => (
                <span
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.id === currentStep
                      ? 'bg-[#0A1931]'
                      : step.id < currentStep
                      ? 'bg-amber-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Barre de progression */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#0A1931] to-amber-500 transition-all duration-300"
              style={{ width: `${Math.max(15, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Vue Complète Tablette & Desktop (sm+) */}
        <ol className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <li
                key={step.id}
                aria-current={isCurrent ? 'step' : undefined}
                className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                  isCurrent
                    ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-sm'
                    : isDone
                      ? 'bg-amber-50/60 text-slate-800 border-amber-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent || isDone ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-3" /> : step.id}
                </div>
                <div className="overflow-hidden">
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                    Étape {step.id}
                    {isCurrent && ' — en cours'}
                  </div>
                  <div className="text-xs font-semibold truncate">{step.label}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
