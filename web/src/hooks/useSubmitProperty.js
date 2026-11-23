import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

export const MIN_PHOTOS = 3;
const MAX_PHOTOS = 30;
const MAX_FILES_PER_REQUEST = 20;
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 Mo, comme le serveur
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Aucune valeur de départ qui constitue une déclaration (statut foncier, équipements,
// nombre de pièces...) : l'utilisateur doit choisir explicitement.
const EMPTY_FORM = {
  title: '',
  transaction_type: 'sale',
  category_id: null,
  city: '',
  neighborhood: '',
  address: '',
  price: '',
  built_area: '',
  land_area: '',
  rooms: '',
  bedrooms: '',
  bathrooms: '',
  land_status: '',
  description: '',
  virtual_tour_url: '',
  amenities: [],
};

const FIELD_LABELS = {
  category_id: 'Catégorie',
  transaction_type: "Type d'opération",
  title: 'Titre',
  description: 'Description',
  price: 'Prix',
  city: 'Ville',
  neighborhood: 'Quartier',
  address: 'Adresse',
  built_area: 'Superficie bâtie',
  land_area: 'Superficie du terrain',
  rooms: 'Pièces',
  bedrooms: 'Chambres',
  bathrooms: 'Salles de bain',
  land_status: 'Statut foncier',
  virtual_tour_url: 'Lien de visite virtuelle',
  amenities: 'Équipements',
  images: 'Photos',
  order: 'Ordre des photos',
};

const STATUS_LABELS = {
  pending: 'en attente de validation',
  published: 'publiée',
  suspended: 'suspendue',
  expired: 'expirée',
};

const toInt = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? n : null;
};

const toText = (value) => {
  const text = String(value ?? '').trim();
  return text === '' ? null : text;
};

// Transforme le formulaire en corps de requête : textes vides -> null, nombres -> entiers
function buildPayload(form, draftStep) {
  return {
    category_id: form.category_id,
    transaction_type: form.transaction_type,
    draft_step: draftStep,
    title: toText(form.title),
    description: toText(form.description),
    price: toInt(form.price),
    city: toText(form.city),
    neighborhood: toText(form.neighborhood),
    address: toText(form.address),
    built_area: toInt(form.built_area),
    land_area: toInt(form.land_area),
    rooms: toInt(form.rooms),
    bedrooms: toInt(form.bedrooms),
    bathrooms: toInt(form.bathrooms),
    land_status: form.land_status || null,
    virtual_tour_url: toText(form.virtual_tour_url),
    amenities: form.amenities,
  };
}

// Liste des champs que l'API exige pour envoyer l'annonce en validation
export function computeMissing(form, photosCount) {
  const missing = [];

  if (!toText(form.title)) missing.push({ field: 'title', label: "Titre de l'annonce", step: 1 });
  if (!form.category_id) missing.push({ field: 'category_id', label: 'Catégorie', step: 1 });
  if (!toText(form.city)) missing.push({ field: 'city', label: 'Ville', step: 1 });
  if (!toText(form.neighborhood)) missing.push({ field: 'neighborhood', label: 'Quartier', step: 1 });

  if (!form.land_status) missing.push({ field: 'land_status', label: 'Statut foncier', step: 2 });
  if (!(toInt(form.built_area) > 0) && !(toInt(form.land_area) > 0)) {
    missing.push({ field: 'area', label: 'Superficie bâtie ou du terrain', step: 2 });
  }

  if (photosCount < MIN_PHOTOS) {
    missing.push({ field: 'images', label: `Photos (minimum ${MIN_PHOTOS})`, step: 3 });
  }

  if (!(toInt(form.price) > 0)) missing.push({ field: 'price', label: 'Prix', step: 4 });
  if (!toText(form.description)) missing.push({ field: 'description', label: 'Description', step: 4 });

  return missing;
}

// Message lisible à partir d'une erreur de l'API (422 : détail champ par champ)
function extractError(err, fallback) {
  if (!err.response) return 'Impossible de joindre le serveur. Vérifiez votre connexion.';

  const { status, data } = err.response;

  if (status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer.';
  if (status === 403) return "Vous n'avez pas le droit de modifier cette annonce.";

  if (status === 422 && data?.errors) {
    const lines = Object.entries(data.errors).map(([field, messages]) => {
      const label = FIELD_LABELS[field.split('.')[0]] || field;
      return `${label} : ${messages[0]}`;
    });
    return [...new Set(lines)].join(' • ');
  }

  return data?.message || fallback;
}

export function useSubmitProperty(initialReference = null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [reference, setReference] = useState(initialReference);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [rejectionReason, setRejectionReason] = useState(null);

  const [isLoadingDraft, setIsLoadingDraft] = useState(Boolean(initialReference));
  const [loadError, setLoadError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPhotoBusy, setIsPhotoBusy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Copies lues par les fonctions asynchrones, qui ne doivent pas dépendre du dernier rendu
  const formRef = useRef(formData);
  const imagesRef = useRef([]);
  const referenceRef = useRef(initialReference);
  const savingRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    formRef.current = formData;
  }, [formData]);

  const applyImages = useCallback((list) => {
    imagesRef.current = list;
    setImages(list);
  }, []);

  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Reprise d'un brouillon (ou d'une annonce refusée) existant
  useEffect(() => {
    if (!initialReference) return undefined;

    let active = true;

    (async () => {
      try {
        const { data } = await api.get(`/my/properties/${initialReference}`);
        if (!active) return;

        const p = data.data;

        if (!['draft', 'rejected'].includes(p.status)) {
          setLoadError(
            `Cette annonce ne peut plus être modifiée depuis ce formulaire (statut : ${STATUS_LABELS[p.status] || p.status}).`
          );
          return;
        }

        setFormData({
          title: p.title ?? '',
          transaction_type: p.transaction_type ?? 'sale',
          category_id: p.category?.id ?? null,
          city: p.city ?? '',
          neighborhood: p.neighborhood ?? '',
          address: p.address ?? '',
          price: p.price ?? '',
          built_area: p.built_area ?? '',
          land_area: p.land_area ?? '',
          rooms: p.rooms ?? '',
          bedrooms: p.bedrooms ?? '',
          bathrooms: p.bathrooms ?? '',
          land_status: p.land_status ?? '',
          description: p.description ?? '',
          virtual_tour_url: p.virtual_tour_url ?? '',
          amenities: (p.amenities || []).map((amenity) => amenity.id),
        });
        applyImages(p.images || []);
        setRejectionReason(p.status === 'rejected' ? p.rejection_reason : null);
        setCurrentStep(Math.min(Math.max(p.draft_step || 1, 1), 4));
      } catch (err) {
        if (!active) return;
        const status = err.response?.status;
        if (status === 404) setLoadError('Annonce introuvable.');
        else if (status === 403) setLoadError("Vous n'avez pas accès à cette annonce.");
        else setLoadError(extractError(err, "Impossible de charger l'annonce."));
      } finally {
        if (active) setIsLoadingDraft(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [initialReference, applyImages]);

  // Enregistre le brouillon : le crée au premier appel, le met à jour ensuite.
  // Un appel pendant qu'une sauvegarde est en cours réutilise celle-ci (double clic : un seul brouillon).
  const saveDraft = useCallback((targetStep = 1) => {
    if (savingRef.current) return savingRef.current;

    const run = (async () => {
      setIsSaving(true);
      setError(null);
      try {
        const payload = buildPayload(formRef.current, targetStep);

        if (!referenceRef.current) {
          const response = await api.post('/my/properties', payload);
          referenceRef.current = response.data.data.reference;
          setReference(referenceRef.current);
        } else {
          await api.put(`/my/properties/${referenceRef.current}`, payload);
        }

        return referenceRef.current;
      } catch (err) {
        setError(extractError(err, "Impossible d'enregistrer le brouillon."));
        throw err;
      } finally {
        setIsSaving(false);
        savingRef.current = null;
      }
    })();

    savingRef.current = run;
    return run;
  }, []);

  // Envoi de photos : contrôle du format et de la taille avant l'envoi, par lots de 20
  const uploadPhotos = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length === 0) return;

      setError(null);

      const problems = [];
      let valid = [];

      files.forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          problems.push(`${file.name} : format non accepté (JPG, PNG ou WebP uniquement)`);
        } else if (file.size > MAX_FILE_SIZE) {
          problems.push(`${file.name} : plus de 12 Mo`);
        } else {
          valid.push(file);
        }
      });

      const room = MAX_PHOTOS - imagesRef.current.length;
      if (valid.length > room) {
        problems.push(`Maximum ${MAX_PHOTOS} photos par annonce : ${valid.length - room} photo(s) ignorée(s)`);
        valid = valid.slice(0, Math.max(room, 0));
      }

      const message = problems.join(' • ');

      if (valid.length === 0) {
        if (message) setError(message);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Le brouillon doit exister avant d'envoyer des photos
        if (!referenceRef.current) await saveDraft(3);

        for (let i = 0; i < valid.length; i += MAX_FILES_PER_REQUEST) {
          const body = new FormData();
          valid.slice(i, i + MAX_FILES_PER_REQUEST).forEach((file) => body.append('images[]', file));

          const response = await api.post(`/my/properties/${referenceRef.current}/images`, body, {
            // Laisse le navigateur écrire l'en-tête multipart avec son séparateur (boundary)
            headers: { 'Content-Type': undefined },
            onUploadProgress: (event) => {
              if (event.total) setUploadProgress(Math.round((event.loaded / event.total) * 100));
            },
          });

          // La réponse du serveur est la source de vérité : ordre, photo principale, identifiants
          applyImages(response.data.data.images);
        }

        if (message) setError(message);
      } catch (err) {
        setError(extractError(err, "Erreur lors de l'envoi des photos."));
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [saveDraft, applyImages]
  );

  const deletePhoto = useCallback(
    async (imageId) => {
      if (!referenceRef.current) return;

      setIsPhotoBusy(true);
      setError(null);
      try {
        const response = await api.delete(`/my/properties/${referenceRef.current}/images/${imageId}`);
        applyImages(response.data.data.images);
      } catch (err) {
        // La photo reste affichée : elle existe toujours sur le serveur
        setError(extractError(err, 'Impossible de supprimer la photo.'));
      } finally {
        setIsPhotoBusy(false);
      }
    },
    [applyImages]
  );

  // Enregistre un nouvel ordre : la première photo de la liste devient la principale
  const applyOrder = useCallback(
    async (orderedIds) => {
      if (!referenceRef.current) return;

      setIsPhotoBusy(true);
      setError(null);
      try {
        const response = await api.put(`/my/properties/${referenceRef.current}/images/order`, {
          order: orderedIds,
        });
        applyImages(response.data.data.images);
      } catch (err) {
        setError(extractError(err, "Impossible de changer l'ordre des photos."));
      } finally {
        setIsPhotoBusy(false);
      }
    },
    [applyImages]
  );

  const setPrimaryPhoto = useCallback(
    (imageId) => {
      const ids = imagesRef.current.map((image) => image.id);
      return applyOrder([imageId, ...ids.filter((id) => id !== imageId)]);
    },
    [applyOrder]
  );

  const movePhoto = useCallback(
    (from, to) => {
      const ids = imagesRef.current.map((image) => image.id);
      if (to < 0 || to >= ids.length || from === to) return undefined;

      const [moved] = ids.splice(from, 1);
      ids.splice(to, 0, moved);
      return applyOrder(ids);
    },
    [applyOrder]
  );

  const missing = useMemo(() => computeMissing(formData, images.length), [formData, images.length]);

  // Envoi final en validation. Retourne true en cas de succès.
  const submitForReview = useCallback(async () => {
    if (submittingRef.current) return false;

    const stillMissing = computeMissing(formRef.current, imagesRef.current.length);
    if (stillMissing.length > 0) {
      setError(`À compléter avant l'envoi : ${stillMissing.map((item) => item.label).join(', ')}.`);
      return false;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await saveDraft(4); // dernière sauvegarde des champs saisis
      await api.post(`/my/properties/${referenceRef.current}/submit`);
      return true;
    } catch (err) {
      setError(extractError(err, "Erreur lors de l'envoi de l'annonce."));
      return false;
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [saveDraft]);

  return {
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
    setError,
  };
}