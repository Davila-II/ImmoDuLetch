import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubmitProperty } from '../hooks/useSubmitProperty';

import StepperHeader from '../components/submit-form/StepperHeader';
import Step1Operation from '../components/submit-form/Step1Operation';
import Step2Details from '../components/submit-form/Step2Details';
import Step3Media from '../components/submit-form/Step3Media';
import Step4Pricing from '../components/submit-form/Step4Pricing';
import LivePreviewCard from '../components/submit-form/LivePreviewCard';

import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    currentStep,
    setCurrentStep,
    reference,
    formData,
    images,
    updateFormField,
    saveDraft,
    uploadPhotos,
    deletePhoto,
    submitForReview,
    isSaving,
    isUploading,
    isSubmitting,
    error,
  } = useSubmitProperty();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xl">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Espace Vendeur Certifié</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pour garantir la fiabilité des mandats et la traçabilité des titres fonciers au Cameroun, veuillez vous connecter pour déposer votre bien.
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

  // Navigation entre les étapes avec sauvegarde continue
  const handleNextFromStep1 = async () => {
    try {
      await saveDraft(2);
      setCurrentStep(2);
    } catch (e) {
      // Erreur gérée par le hook
    }
  };

  const handleNextFromStep2 = async () => {
    try {
      await saveDraft(3);
      setCurrentStep(3);
    } catch (e) {
      // Erreur gérée par le hook
    }
  };

  const handleNextFromStep3 = () => {
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    const success = await submitForReview();
    if (success) {
      alert("Votre annonce a été soumise avec succès ! Elle sera validée par nos experts fonciers sous 24h.");
      navigate('/my-account');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Stepper Header Sticky */}
      <StepperHeader
        currentStep={currentStep}
        reference={reference}
        isSaving={isSaving}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Layout en 2 Colonnes (Formulaire à Gauche 65% + Live Preview Sticky à Droite 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Formulaire (Étape active) */}
          <div className="lg:col-span-8">
            {currentStep === 1 && (
              <Step1Operation
                formData={formData}
                onChange={updateFormField}
                onNext={handleNextFromStep1}
                isSaving={isSaving}
              />
            )}

            {currentStep === 2 && (
              <Step2Details
                formData={formData}
                onChange={updateFormField}
                onNext={handleNextFromStep2}
                onPrev={() => setCurrentStep(1)}
                isSaving={isSaving}
              />
            )}

            {currentStep === 3 && (
              <Step3Media
                images={images}
                onAddFiles={uploadPhotos}
                onDeleteImage={deletePhoto}
                onPrev={() => setCurrentStep(2)}
                onNext={handleNextFromStep3}
                isUploading={isUploading}
              />
            )}

            {currentStep === 4 && (
              <Step4Pricing
                formData={formData}
                onChange={updateFormField}
                onPrev={() => setCurrentStep(3)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Colonne Droite : Live Preview Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <LivePreviewCard
              formData={formData}
              images={images}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
