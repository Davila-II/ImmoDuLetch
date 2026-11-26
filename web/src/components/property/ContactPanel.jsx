import { BadgeCheck, MessageSquare, Phone } from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';
import { phoneHref, whatsAppLink } from '../../utils/contact';
import InquiryForm from './InquiryForm';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactPanel({ property }) {
  const { t } = useLanguage();
  const { reference, contact } = property;
  const whatsapp = whatsAppLink(contact?.phone, reference);
  const call = phoneHref(contact?.phone);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{t('footer.contact', null, 'Contact')}</span>
        <h3 className="text-lg font-extrabold text-[#0A1931]">{t('detail.contactTitle', null, 'Contacter pour ce bien')}</h3>
        {contact?.name && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            {contact.name}
            {contact.is_certified_agency && (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" /> {t('detail.certifiedAgency', null, 'Agence certifiée')}
              </span>
            )}
          </p>
        )}
        <p className="text-xs text-slate-400">{t('detail.reference', null, 'Réf :')} {reference}</p>
      </div>

      {(whatsapp || call) && (
        <div className="space-y-2">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => inquiryService.track(reference, 'whatsapp')}
              className="w-full bg-[#25D366] hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          )}
          {call && (
            <a
              href={call}
              onClick={() => inquiryService.track(reference, 'call')}
              className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{t('detail.callAgency', null, 'Appeler')}</span>
            </a>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 mb-3">{t('detail.planExchange', null, 'Planifier un échange ou une visite')}</h4>
        <InquiryForm reference={reference} />
      </div>
    </div>
  );
}