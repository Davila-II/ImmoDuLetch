import { Heart } from 'lucide-react';
import { useFavoriteToggle } from '../../hooks/useFavoriteToggle';
import LoginPromptToast from '../LoginPromptToast';
import { useLanguage } from '../../context/LanguageContext';

const VARIANTS = {
  // Pastille ronde posée sur la photo d'une carte (à positionner avec className)
  icon: (isFav) =>
    `p-2 rounded-full backdrop-blur-md transition ${
      isFav ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
    }`,
  // Bouton avec texte, pour la fiche d'un bien
  pill: (isFav) =>
    `flex items-center gap-1.5 px-3 py-1 rounded transition font-medium ${
      isFav
        ? 'bg-rose-50 text-rose-600 border border-rose-200'
        : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
    }`,
};

export default function FavoriteButton({ property, variant = 'icon', className = '', onChange }) {
  const { t } = useLanguage();
  const { isFav, loadingFav, showLoginHint, toggle, dismissHint } = useFavoriteToggle(property);
  const label = isFav ? t('card.favoriteRemove', null, 'Retirer des favoris') : t('card.favoriteAdd', null, 'Ajouter aux favoris');

  const handleClick = async (event) => {
    const next = await toggle(event);
    if (next !== null && onChange) onChange(property.reference, next);
  };

  return (
    <>
      {showLoginHint && <LoginPromptToast onClose={dismissHint} />}

      <button
        type="button"
        onClick={handleClick}
        disabled={loadingFav}
        aria-label={label}
        title={label}
        className={`${VARIANTS[variant](isFav)} ${className}`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        {variant === 'pill' && <span>{isFav ? t('detail.favorite', null, 'Favori') : t('detail.saveFavorite', null, 'Enregistrer')}</span>}
      </button>
    </>
  );
}