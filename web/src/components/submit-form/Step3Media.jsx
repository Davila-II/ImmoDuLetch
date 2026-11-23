import React, { useRef } from 'react';
import { UploadCloud, Trash2, Star, ArrowLeft, ArrowRight } from 'lucide-react';

const MIN_PHOTOS = 3;

export default function Step3Media({
  images,
  onAddFiles,
  onDeleteImage,
  onSetPrimary,
  onMove,
  onPrev,
  onNext,
  isUploading,
  uploadProgress = 0,
  isBusy = false,
}) {
  const fileInputRef = useRef(null);
  const canContinue = images.length >= MIN_PHOTOS && !isUploading && !isBusy;

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">GALERIE VISUELLE</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Photographies</h2>
        <p className="text-slate-500 mt-1">
          La première image est le visuel de vitrine. Minimum {MIN_PHOTOS} photos requises.
        </p>
      </div>

      {/* Zone de dépôt */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-amber-50/20 transition cursor-pointer space-y-3"
      >
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="font-bold text-slate-800 text-sm">Glissez-déposez vos photographies ici</div>
        <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
          Formats acceptés : JPG, PNG, WebP (12 Mo maximum par photo, 30 photos par annonce). Les photos HEIC des iPhone
          ne sont pas acceptées : exportez-les en JPG.
        </p>
        <span className="bg-[#0A1931] text-white font-bold py-2.5 px-5 rounded-lg text-xs inline-block">
          Sélectionner des photos
        </span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            onAddFiles(Array.from(e.target.files || []));
            e.target.value = ''; // permet de choisir à nouveau le même fichier
          }}
        />
      </div>

      {/* Progression de l'envoi */}
      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
            <span>Envoi des photos…</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Photos : leur ordre et leur photo principale sont ceux du serveur */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              {images.length} photo(s)
            </span>
            <span className="text-slate-400 text-[11px]">
              {images.length < MIN_PHOTOS
                ? `Encore ${MIN_PHOTOS - images.length} photo(s) requise(s)`
                : `Minimum atteint (${MIN_PHOTOS})`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;

              return (
                <div
                  key={img.id}
                  className={`group relative rounded-xl overflow-hidden border-2 aspect-4/3 bg-slate-100 shadow-xs transition ${
                    isPrimary ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                  }`}
                >
                  <img src={img.url} alt={img.caption || `Photo ${idx + 1}`} className="w-full h-full object-cover" />

                  {isPrimary && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Principale</span>
                    </div>
                  )}

                  {/* Actions : toujours visibles sur écran tactile, au survol sur ordinateur */}
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 p-1.5 flex items-center justify-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={isBusy || idx === 0}
                      onClick={() => onMove(idx, idx - 1)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 disabled:opacity-40"
                      title="Déplacer vers le début"
                      aria-label="Déplacer vers le début"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isBusy || idx === images.length - 1}
                      onClick={() => onMove(idx, idx + 1)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 disabled:opacity-40"
                      title="Déplacer vers la fin"
                      aria-label="Déplacer vers la fin"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {!isPrimary && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onSetPrimary(img.id)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 hover:text-amber-600 disabled:opacity-40"
                        title="Définir comme photo principale"
                        aria-label="Définir comme photo principale"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onDeleteImage(img.id)}
                      className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40"
                      title="Supprimer la photo"
                      aria-label="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute top-1 right-1 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <button type="button" onClick={onPrev} className="text-slate-600 font-bold hover:text-slate-900 transition">
          ← Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className={`font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition shadow-sm ${
            canContinue ? 'bg-[#F5A623] hover:bg-[#E29512] text-slate-950' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{isUploading ? 'Envoi des photos...' : 'Continuer vers Prix & Validation'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}