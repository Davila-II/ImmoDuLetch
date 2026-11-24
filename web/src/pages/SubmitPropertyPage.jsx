import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, X } from 'lucide-react';
import { useSubmitProperty } from '../hooks/useSubmitProperty';

import StepperHeader from '../components/submit-form/StepperHeader';
import Step1Operation from '../components/submit-form/Step1Operation';
import Step2Details from '../components/submit-form/Step2Details';
import Step3Media from '../components/submit-form/Step3Media';
import Step4Pricing from '../components/submit-form/Step4Pricing';
import LivePreviewCard from '../components/submit-form/LivePreviewCard';

function SubmitProperty({ initialReference }) {
  const navigate = useNavigate();
  const [submittedReference, setSubmittedReference] = useState(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const {
    currentStep,
    setCurrentStep,
    reference,
    formData,
    images,
    missing,
    rejectionReason,
    updateFormField,
    saveDraft,
    uploadPhotos,
    deletePhoto,
    setPrimaryPhoto,
    movePhoto,
    submitForReview,
    isLoadingDraft,
    loadError,
    isSaving,
    isUploading,
    uploadProgress,
    isPhotoBusy,
    isSubmitting,
    error,
  } = useSubmitProperty(initialReference);

  const missingFor = (step) => missing.filter((item) => item.step === step);

  if (isLoadingDraft) {
    return <div className="max-w-md mx-auto my-20 text-center text-sm text-slate-500">Chargement de l'annonce…</div>;
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-700">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate('/my-account')}
          className="w-full bg-[#0A1931] hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Retour à mes annonces
        </button>
      </div>
    );
  }

  if (submittedReference) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Annonce envoyée</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Votre annonce <span className="font-mono font-bold">{submittedReference}</span> a été envoyée. Elle sera
          examinée par notre équipe avant d'être publiée. Vous pouvez suivre son statut dans « Mes annonces ».
        </p>
        <button
          type="button"
          onClick={() => navigate('/my-account')}
          className="w-full bg-[#0A1931] hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Voir mes annonces
        </button>
      </div>
    );
  }

  const goNext = async (savedStep, nextStep) => {
    try {
      await saveDraft(savedStep);
      setCurrentStep(nextStep);
    } catch {
      // L'erreur est déjà affichée par le hook
    }
  };

  const handleFinalSubmit = async () => {
    const success = await submitForReview();
    if (success) setSubmittedReference(reference);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <StepperHeader currentStep={currentStep} reference={reference} isSaving={isSaving} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton aperçu mobile rapide */}
        <div className="lg:hidden mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Aperçu de l'annonce</span>
          </button>
        </div>

        {rejectionReason && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 text-xs p-4 rounded-xl">
            <div className="font-bold mb-1">Votre annonce a été refusée</div>
            <div>Motif : {rejectionReason}</div>
            <div className="mt-1 text-amber-700">Corrigez-la, puis envoyez-la à nouveau pour validation.</div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 w-full">
            {currentStep === 1 && (
              <Step1Operation
                formData={formData}
                onChange={updateFormField}
                onNext={() => goNext(2, 2)}
                isSaving={isSaving}
                missing={missingFor(1)}
              />
            )}

            {currentStep === 2 && (
              <Step2Details
                formData={formData}
                onChange={updateFormField}
                onNext={() => goNext(3, 3)}
                onPrev={() => setCurrentStep(1)}
                isSaving={isSaving}
                missing={missingFor(2)}
              />
            )}

            {currentStep === 3 && (
              <Step3Media
                images={images}
                onAddFiles={uploadPhotos}
                onDeleteImage={deletePhoto}
                onSetPrimary={setPrimaryPhoto}
                onMove={movePhoto}
                onPrev={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                isBusy={isPhotoBusy}
              />
            )}

            {currentStep === 4 && (
              <Step4Pricing
                formData={formData}
                onChange={updateFormField}
                onPrev={() => setCurrentStep(3)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
                missing={missing}
                onGoToStep={setCurrentStep}
              />
            )}
          </div>

          {/* Aperçu Desktop Sticky */}
          <div className="lg:col-span-4 hidden lg:block sticky top-24">
            <LivePreviewCard formData={formData} images={images} />
          </div>
        </div>
      </div>

      {/* Modal / Tiroir d'aperçu Mobile */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" />
                Aperçu de votre annonce
              </span>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LivePreviewCard formData={formData} images={images} />
            <button
              type="button"
              onClick={() => setShowMobilePreview(false)}
              className="w-full bg-[#0A1931] text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmitPropertyPage() {
  const { reference } = useParams();
  return <SubmitProperty key={reference ?? 'new'} initialReference={reference ?? null} />;
}
