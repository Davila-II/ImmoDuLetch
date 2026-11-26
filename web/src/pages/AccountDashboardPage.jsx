import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Building } from 'lucide-react';
import InquiryItem from '../components/dashboard/InquiryItem';
import MyPropertyCard from '../components/dashboard/MyPropertyCard';
import ProfileHeader from '../components/dashboard/ProfileHeader';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { usePaginatedResource } from '../hooks/usePaginatedResource';
import { inquiryService } from '../services/inquiryService';
import { propertyService } from '../services/propertyService';
import { formatNumber } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';

const NO_STATS = { total: 0, views: 0, contacts: 0 };

function LoadMore({ show, loading, onClick, label }) {
  if (!show) return null;

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2 rounded-lg text-xs disabled:opacity-50"
      >
        {loading ? 'Chargement…' : label}
      </button>
    </div>
  );
}

export default function AccountDashboardPage() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('properties');
  const [actionError, setActionError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  const properties = usePaginatedResource('/my/properties');
  const inquiries = usePaginatedResource('/my/inquiries');

  const stats = properties.extra.stats ?? NO_STATS;
  const newCount = inquiries.extra.stats?.new ?? 0;
  const loadError = properties.error || inquiries.error;
  const loading = properties.loading || inquiries.loading;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const reloadAll = () => {
    properties.reload();
    inquiries.reload();
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Supprimer l'annonce « ${property.title || property.reference} » ?`)) return;

    setBusyKey(`property-${property.reference}`);
    setActionError(null);
    try {
      await propertyService.remove(property.reference);
      properties.reload();
    } catch {
      setActionError("Impossible de supprimer l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleInquiryStatus = async (inquiry, status) => {
    setBusyKey(`inquiry-${inquiry.id}`);
    setActionError(null);
    try {
      const updated = await inquiryService.updateStatus(inquiry.id, status);
      inquiries.updateItems((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      if (inquiry.status === 'new') {
        inquiries.updateExtra((extra) => ({
          ...extra,
          stats: { ...extra.stats, new: Math.max(0, (extra.stats?.new ?? 0) - 1) },
        }));
      }
    } catch {
      setActionError('Impossible de mettre à jour la demande.');
    } finally {
      setBusyKey(null);
    }
  };

  const tabs = [
    { id: 'properties', label: `${t('dashboard.myProperties', null, 'Mes annonces')} (${stats.total})` },
    { id: 'inquiries', label: `${t('dashboard.inquiriesReceived', null, 'Demandes reçues')}${newCount > 0 ? ` (${t('dashboard.newInquiries', { count: newCount }, `${newCount} nouvelles`)})` : ''}` },
  ];

  const summary = [
    { label: t('dashboard.myProperties', null, 'Mes annonces'), value: stats.total },
    { label: t('dashboard.totalViews', null, 'Vues totales'), value: formatNumber(stats.views) },
    { label: t('dashboard.contactsReceived', null, 'Contacts reçus'), value: stats.contacts },
    { label: t('dashboard.unreadInquiries', null, 'Demandes non lues'), value: newCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ProfileHeader user={user} onLogout={handleLogout} />

      {loadError && (
        <Alert className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {loadError}
          </span>
          <button type="button" onClick={reloadAll} className="font-bold underline shrink-0">
            {t('catalog.clear', null, 'Réessayer')}
          </button>
        </Alert>
      )}
      {actionError && <Alert>{actionError}</Alert>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summary.map((item) => (
          <div key={item.label} className="bg-white p-5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">{item.label}</span>
            <div className="text-2xl font-black text-[#0A1931] mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="border-b border-slate-200 flex gap-6">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === tab.id
                ? 'border-[#0A1931] text-[#0A1931]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'properties' && (
        <div className="space-y-4">
          {loading && <p className="text-xs text-slate-500">Chargement…</p>}

          {properties.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.items.map((property) => (
                <MyPropertyCard
                  key={property.reference}
                  property={property}
                  busy={busyKey === `property-${property.reference}`}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <LoadMore
            show={properties.hasMore}
            loading={properties.loadingMore}
            onClick={properties.loadMore}
            label={t('catalog.loadMore', null, "Voir plus d'annonces")}
          />

          {!loading && !loadError && properties.items.length === 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 text-sm font-semibold">{t('dashboard.noProperties', null, "Vous n'avez pas encore d'annonce.")}</p>
              <Link to="/deposer" className="inline-block bg-[#F5A623] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs">
                {t('dashboard.depositFirst', null, 'Déposer mon premier bien')}
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {loading && <p className="text-xs text-slate-500">Chargement…</p>}

          {inquiries.items.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {inquiries.items.map((inquiry) => (
                <InquiryItem
                  key={inquiry.id}
                  inquiry={inquiry}
                  busy={busyKey === `inquiry-${inquiry.id}`}
                  onStatusChange={handleInquiryStatus}
                />
              ))}
            </div>
          )}

          <LoadMore
            show={inquiries.hasMore}
            loading={inquiries.loadingMore}
            onClick={inquiries.loadMore}
            label="Voir plus de demandes"
          />

          {!loading && !loadError && inquiries.items.length === 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              {t('dashboard.noInquiries', null, "Aucune demande reçue pour l'instant.")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}