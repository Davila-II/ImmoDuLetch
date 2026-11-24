import { useState } from 'react';

export default function PropertyGallery({ images = [], title }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-16/9 md:aspect-21/9 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-sm text-slate-400">
        Photos à venir
      </div>
    );
  }

  const current = images[Math.min(selected, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-16/9 md:aspect-21/9 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <img src={current.url} alt={current.caption || title} className="w-full h-full object-cover" />
        {current.caption && (
          <span className="absolute bottom-3 left-3 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded">
            {current.caption}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelected(index)}
              aria-label={`Photo ${index + 1}`}
              className={`relative w-20 h-14 sm:w-28 sm:h-18 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                selected === index ? 'border-[#F5A623]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={image.url} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}