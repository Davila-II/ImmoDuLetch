import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Star, ArrowUp, ArrowDown } from 'lucide-react';

export default function Step3Media({ 
  images, 
  onAddFiles, 
  onDeleteImage, 
  onSetPrimary, 
  onPrev, 
  onNext, 
  isUploading,
  uploadProgress 
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">GALERIE VISUELLE</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Photographies &amp; Médias Certifiés</h2>
        <p className="text-slate-500 mt-1">
          La première image sera le visuel de vitrine officiel. Minimum 3 clichés requis pour validation.
        </p>
      </div>

      {/* DROPZONE PRINCIPALE (comme screen (5).png) */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-amber-50/20 transition cursor-pointer space-y-3"
      >
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="font-bold text-slate-800 text-sm">
          Glissez et déposez vos photographies haute définition
        </div>
        <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
          Formats acceptés : JPG, PNG, WebP (jusqu'à 12 Mo par photo). Conversion automatique en WebP 2000px.
        </p>
        <button
          type="button"
          className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-lg text-xs inline-block transition"
        >
          Sélectionner des clichés
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onAddFiles(e.target.files);
          }}
        />
      </div>

      {/* GRILLE DES PHOTOS EXISTANTES OU EN ATTENTE */}
      {images && images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              {images.length} visuel(s) indexé(s)
            </span>
            <span className="text-slate-400 text-[11px]">
              {images.length < 3 ? `Encore ${3 - images.length} photo(s) requise(s)` : 'Condition validée (min. 3)'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => {
              const isPrimary = idx === 0 || img.is_primary;
              const previewUrl = img.url || (img.file ? URL.createObjectURL(img.file) : '');

              return (
                <div
                  key={img.id || idx}
                  className={`group relative rounded-xl overflow-hidden border-2 aspect-4/3 bg-slate-100 shadow-xs transition ${
                    isPrimary ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* Badge Principale */}
                  {isPrimary && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Principale</span>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isPrimary && onSetPrimary && (
                      <button
                        type="button"
                        onClick={() => onSetPrimary(idx)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 hover:text-amber-600"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteImage(idx, img.id)}
                      className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="text-slate-600 font-bold hover:text-slate-900 transition"
        >
          ← Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={images.length < 3 || isUploading}
          className={`font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-sm ${
            images.length >= 3 && !isUploading
              ? 'bg-[#F5A623] hover:bg-[#E29512] text-slate-950'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{isUploading ? 'Envoi des photos...' : 'Continuer vers Prix & Validation'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
