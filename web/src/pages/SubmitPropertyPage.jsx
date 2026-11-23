import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubmitProperty } from '../hooks/useSubmitProperty';

import StepperHeader from '../components/submit-form/StepperHeader';
import Step1Operation from '../components/submit-form/Step1Operation';
import Step2Details from '../components/submit-form/Step2Details';
import Step3Media from '../components/submit-form/Step3Media';
import Step4Pricing from '../components/submit-form/Step4Pricing';
import LivePreviewCard from '../components/submit-form/LivePreviewCard';

import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Présent seulement sur la route de reprise d'un brouillon (/…/:reference)
  const { reference: routeReference } = useParams();
  const [submittedReference, setSubmittedReference] = useState(null);

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
  } = useSubmitProperty(routeReference || null);

  const missingFor = (step) => missing.filter((item) => item.step === step);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xl">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Espace vendeur</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pour déposer une annonce, veuillez vous connecter ou créer un compte.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#0A1931] hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Se connecter ou créer un compte
        </button>
      </div>
    );
  }

  if (isLoadingDraft) {
    return <div className="max-w-md mx-auto my-20 text-center text-sm text-slate-500">Chargement de l'annonce…</div>;
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-700">{loadError}</p>
        <button
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
          onClick={() => navigate('/my-account')}
          className="w-full bg-[#0A1931] hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold transition shadow-sm"
        >
          Voir mes annonces
        </button>
      </div>
    );
  }

  // Navigation entre les étapes avec sauvegarde du brouillon
  const goNext = async (savedStep, nextStep) => {
    try {
      await saveDraft(savedStep);
      setCurrentStep(nextStep);
    } catch (e) {
      // L'erreur est affichée par le hook
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
          {/* Formulaire de l'étape active */}
          <div className="lg:col-span-8">
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

          {/* Aperçu en direct */}
          <div className="lg:col-span-4 hidden lg:block">
            <LivePreviewCard formData={formData} images={images} />
          </div>
        </div>
      </div>
    </div>
  );
}