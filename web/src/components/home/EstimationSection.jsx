import { ESTIMATION } from '../../constants/siteContent';
import EstimationForm from './EstimationForm';
import { useLanguage } from '../../context/LanguageContext';

export default function EstimationSection() {
  const { t } = useLanguage();

  const steps = [
    t('estimation.step1', null, ESTIMATION.steps[0]),
    t('estimation.step2', null, ESTIMATION.steps[1]),
    t('estimation.step3', null, ESTIMATION.steps[2]),
  ];

  return (
    <section id="estimation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="bg-[#0A1931] rounded-2xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl">
        <div className="space-y-6">
          <span className="bg-amber-400 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full">
            {t('estimation.badge', null, ESTIMATION.badge)}
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">{t('estimation.title', null, ESTIMATION.title)}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{t('estimation.text', null, ESTIMATION.text)}</p>

          <ol className="space-y-3 pt-2">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-xl p-6 text-slate-800 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-1">{t('estimation.formTitle', null, ESTIMATION.formTitle)}</h3>
          <p className="text-xs text-slate-500 mb-4">{t('estimation.subtitle', null, ESTIMATION.formSubtitle)}</p>
          <EstimationForm />
        </div>
      </div>
    </section>
  );
}