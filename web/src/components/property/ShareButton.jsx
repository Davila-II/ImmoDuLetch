import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ShareButton({ title, city }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Bien immobilier sur Immo du Letch',
          text: `Découvrez ce bien à ${city || 'Cameroun'} sur Immo du Letch :`,
          url,
        });
      } catch {
        /* partage annulé par l'utilisateur */
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copiez ce lien :', url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded transition"
      title={t('detail.share', null, 'Partager ce bien')}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
      <span>{copied ? t('detail.linkCopied', null, 'Lien copié !') : t('detail.share', null, 'Partager')}</span>
    </button>
  );
}