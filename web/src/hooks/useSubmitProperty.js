import { useState, useCallback } from 'react';
import api from '../services/api';

const INITIAL_FORM_DATA = {
  title: '',
  transaction_type: 'sale',
  category_id: 1,
  city: 'Douala',
  neighborhood: '',
  address: '',
  price: '',
  built_area: '',
  land_area: '',
  rooms: 5,
  bedrooms: 3,
  bathrooms: 2,
  land_status: 'title_available',
  description: '',
  virtual_tour_url: '',
  amenities: [1, 2], // Forage et Groupe par défaut
};

export function useSubmitProperty() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reference, setReference] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [images, setImages] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Étape 1 & Sauvegarde du brouillon
  const saveDraft = async (targetStep) => {
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        draft_step: targetStep || currentStep,
      };

      if (!reference) {
        // Création initiale du brouillon
        const response = await api.post('/my/properties', payload);
        const prop = response.data?.data || response.data;
        const newRef = prop.reference;
        setReference(newRef);
        return newRef;
      } else {
        // Mise à jour continue
        await api.put(`/my/properties/${reference}`, payload);
        return reference;
      }
    } catch (err) {
      console.error('Erreur sauvegarde brouillon', err);
      setError("Impossible d'enregistrer le brouillon. Vérifiez votre connexion.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Upload des images (Minimum 3 requises pour valider)
  const uploadPhotos = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      // S'assurer que le brouillon est créé d'abord
      let activeRef = reference;
      if (!activeRef) {
        activeRef = await saveDraft(2);
      }

      const uploadData = new FormData();
      Array.from(files).forEach((file) => {
        uploadData.append('images[]', file);
      });

      // Ne pas forcer Content-Type: multipart/form-data manuellement sans boundary ;
      // laisser le navigateur générer automatiquement avec le bon boundary
      const response = await api.post(`/my/properties/${activeRef}/images`, uploadData, {
        headers: {
          'Content-Type': undefined,
        },
      });

      // Synchroniser la liste des images depuis la réponse API
      const propData = response.data?.data || response.data;
      if (propData && propData.images) {
        setImages(propData.images);
      }
    } catch (err) {
      console.error('Erreur upload photos', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || "Erreur lors de l'envoi des photos.";
      setError(serverMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Suppression d'une image
  const deletePhoto = async (index, imageId) => {
    if (imageId && reference) {
      try {
        await api.delete(`/my/properties/${reference}/images/${imageId}`);
      } catch (err) {
        console.error('Erreur suppression photo API', err);
      }
    }
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Soumission finale de l'annonce pour vérification
  const submitForReview = async () => {
    if (images.length < 3) {
      setError("Au moins 3 photographies sont obligatoires pour soumettre l'annonce.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Dernière sauvegarde des données saisies (étape 4)
      await saveDraft(4);
      // Appel de soumission officielle
      await api.post(`/my/properties/${reference}/submit`);
      return true;
    } catch (err) {
      console.error('Erreur soumission annonce', err);
      setError("Erreur lors de la soumission de l'annonce.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    setError,
  };
}
