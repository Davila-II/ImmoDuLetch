import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Building, MapPin, UploadCloud, CheckCircle, 
  ArrowRight, ArrowLeft, ShieldCheck, Plus, AlertCircle 
} from 'lucide-react';

export default function SubmitPropertyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdRef, setCreatedRef] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    transaction_type: 'sale',
    category_id: 1, // Villa
    city: 'Douala',
    neighborhood: '',
    address: '',
    price: '',
    built_area: '',
    land_area: '',
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    land_status: 'titre_disponible',
    description: '',
  });

  const [images, setImages] = useState([]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-lg">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Connexion requise</h2>
        <p className="text-xs text-slate-500">Pour déposer et gérer une annonce certifiée sur Immo du Letch, vous devez être connecté.</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#0A1931] text-white py-2.5 rounded-lg text-xs font-bold"
        >
          Se connecter ou créer un compte
        </button>
      </div>
    );
  }

  // Étape 1 : Création du brouillon
  const handleCreateDraft = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/my/properties', formData);
      setCreatedRef(res.data.reference);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de l'annonce. Vérifiez les informations.");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Upload des photos
  const handleUploadImages = async (e) => {
    e.preventDefault();
    if (images.length < 3) {
      setError("Veuillez sélectionner au moins 3 photos pour valider l'annonce.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const uploadData = new FormData();
      Array.from(images).forEach((file) => {
        uploadData.append('images[]', file);
      });
      await api.post(`/my/properties/${createdRef}/images`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi des photos.");
    } finally {
      setLoading(false);
    }
  };

  // Étape 3 : Soumission finale pour validation
  const handleSubmitForReview = async () => {
    setLoading(true);
    try {
      await api.post(`/my/properties/${createdRef}/submit`);
      navigate('/my-account');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi pour validation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Stepper Header (screen (5).png) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-[#0A1931]">
          Déposer une Annonce Immobilière — Cameroun
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Portail vendeur certifié • Vérification cadastrale &amp; accompagnement notarié
        </p>

        {/* Barre d'étapes */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className={`p-2 rounded-lg text-center text-xs font-bold ${step === 1 ? 'bg-[#0A1931] text-white' : 'bg-slate-100 text-slate-600'}`}>
            1. Caractéristiques
          </div>
          <div className={`p-2 rounded-lg text-center text-xs font-bold ${step === 2 ? 'bg-[#0A1931] text-white' : 'bg-slate-100 text-slate-600'}`}>
            2. Photos &amp; Médias
          </div>
          <div className={`p-2 rounded-lg text-center text-xs font-bold ${step === 3 ? 'bg-[#0A1931] text-white' : 'bg-slate-100 text-slate-600'}`}>
            3. Finalisation
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ÉTAPE 1 : FORMULAIRE CARACTÉRISTIQUES */}
      {step === 1 && (
        <form onSubmit={handleCreateDraft} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Titre de l'annonce</label>
            <input
              type="text"
              required
              placeholder="Ex : Superbe Villa Duplex avec Piscine et Forage"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Type d'opération</label>
              <select
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="sale">À Vendre (Cession de propriété)</option>
                <option value="rent">À Louer (Bail)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prix souhaité (FCFA)</label>
              <input
                type="number"
                required
                placeholder="Ex : 185000000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ville</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Kribi">Kribi</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quartier</label>
              <input
                type="text"
                placeholder="Ex : Bonapriso ou Bastos"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          {/* Statut Foncier */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Statut Foncier Déclaré</label>
            <select
              value={formData.land_status}
              onChange={(e) => setFormData({ ...formData, land_status: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
            >
              <option value="titre_disponible">Titre foncier disponible (Certificat de propriété)</option>
              <option value="verifie_professionnel">Document vérifié par un professionnel</option>
              <option value="en_cours">Procédure en cours (Mutation en cours)</option>
              <option value="a_verifier">À auditer par nos notaires</option>
            </select>
          </div>

          {/* Surfaces & Pièces */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Surface bâtie (m²)</label>
              <input
                type="number"
                value={formData.built_area}
                onChange={(e) => setFormData({ ...formData, built_area: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Terrain (m²)</label>
              <input
                type="number"
                value={formData.land_area}
                onChange={(e) => setFormData({ ...formData, land_area: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Chambres</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Salles de bain</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description détaillée</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez les atouts majeurs (forage, groupe, accès bitumé, sécurité)..."
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <span>{loading ? "Création du brouillon..." : "Continuer vers les photos"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ÉTAPE 2 : UPLOAD DES PHOTOS (Minimum 3 photos) */}
      {step === 2 && (
        <form onSubmit={handleUploadImages} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="text-center space-y-2 border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-slate-50">
            <UploadCloud className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Ajoutez les photos de votre bien</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sélectionnez <strong>au minimum 3 photos</strong> de bonne qualité (format JPEG, PNG ou WebP).
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0A1931] file:text-white hover:file:bg-slate-800"
            />
            {images.length > 0 && (
              <p className="text-emerald-700 font-bold mt-2">
                {images.length} photo(s) sélectionnée(s)
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-600 font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              type="submit"
              disabled={loading || images.length < 3}
              className={`font-bold py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 transition ${
                images.length >= 3
                  ? 'bg-[#F5A623] hover:bg-[#E29512] text-slate-950'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{loading ? "Traitement des photos..." : "Uploader les photos"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ÉTAPE 3 : CONFIRMATION & VALIDATION */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black text-[#0A1931]">Votre annonce est prête !</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Référence générée : <strong>{createdRef}</strong>. Les photos ont été optimisées en WebP haute définition.
            Cliquez ci-dessous pour soumettre votre bien à la validation de notre équipe d'experts fonciers.
          </p>

          <button
            onClick={handleSubmitForReview}
            disabled={loading}
            className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl text-sm transition shadow-lg"
          >
            {loading ? "Soumission en cours..." : "Soumettre mon annonce en validation"}
          </button>
        </div>
      )}
    </div>
  );
}
