import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Eye, MessageSquare, Plus, LogOut, Edit3, ExternalLink, Trash2, AlertCircle, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_BADGES = {
  published: { label: 'Publiée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'En validation', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  rejected: { label: 'Refusée', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  suspended: { label: 'Suspendue', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  expired: { label: 'Expirée', className: 'bg-slate-100 text-slate-500 border-slate-300' },
};

const INQUIRY_TYPES = {
  contact: 'Message',
  visit: 'Demande de visite',
  whatsapp: 'Clic WhatsApp',
  call: 'Clic Appeler',
};

const INQUIRY_STATUS = {
  new: { label: 'Nouveau', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  read: { label: 'Lu', className: 'bg-slate-100 text-slate-600 border-slate-300' },
  handled: { label: 'Traité', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const formatPrice = (property) => {
  if (!property.price) return 'Prix non défini';
  const value = new Intl.NumberFormat('fr-FR').format(property.price);
  return property.transaction_type === 'rent' ? `${value} FCFA / mois` : `${value} FCFA`;
};

const accountLabel = (user) => {
  if (user?.account_type === 'agence') {
    return user.agency?.is_certified ? 'Agence certifiée' : 'Compte agence';
  }
  return user?.account_type === 'independant' ? 'Indépendant' : 'Particulier';
};

export default function AccountDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('properties');

  const [properties, setProperties] = useState([]);
  const [propsPage, setPropsPage] = useState({ current: 1, last: 1 });
  const [stats, setStats] = useState({ total: 0, views: 0, contacts: 0 });

  const [inquiries, setInquiries] = useState([]);
  const [inqPage, setInqPage] = useState({ current: 1, last: 1 });
  const [newCount, setNewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  const loadProperties = useCallback(async (page = 1) => {
    const { data } = await api.get('/my/properties', { params: { page } });
    setProperties((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    setPropsPage({ current: data.meta.current_page, last: data.meta.last_page });
    setStats(data.stats);
  }, []);

  const loadInquiries = useCallback(async (page = 1) => {
    const { data } = await api.get('/my/inquiries', { params: { page } });
    setInquiries((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
    setInqPage({ current: data.meta.current_page, last: data.meta.last_page });
    setNewCount(data.stats.new);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled([loadProperties(1), loadInquiries(1)]);

    if (results.some((result) => result.status === 'rejected')) {
      setError("Impossible de charger toutes vos données. Vérifiez votre connexion, puis réessayez.");
    }
    setLoading(false);
  }, [loadProperties, loadInquiries]);

  useEffect(() => {
    if (user) loadAll();
  }, [user?.id, loadAll]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const loadMore = async (kind) => {
    setLoadingMore(true);
    setActionError(null);
    try {
      if (kind === 'properties') await loadProperties(propsPage.current + 1);
      else await loadInquiries(inqPage.current + 1);
    } catch {
      setActionError('Impossible de charger la suite.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Supprimer l'annonce « ${property.title || property.reference} » ?`)) return;

    setBusyKey(`prop-${property.reference}`);
    setActionError(null);
    try {
      await api.delete(`/my/properties/${property.reference}`);
      await loadProperties(1);
    } catch {
      setActionError("Impossible de supprimer l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const updateInquiry = async (inquiry, status) => {
    setBusyKey(`inq-${inquiry.id}`);
    setActionError(null);
    try {
      const { data } = await api.patch(`/my/inquiries/${inquiry.id}`, { status });
      setInquiries((prev) => prev.map((item) => (item.id === inquiry.id ? data.data : item)));
      if (inquiry.status === 'new') setNewCount((count) => Math.max(0, count - 1));
    } catch {
      setActionError('Impossible de mettre à jour la demande.');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête du profil */}
      <div className="bg-[#0A1931] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ID'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold">{user?.name}</h1>
              <span className="bg-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-300/30">
                {accountLabel(user)}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {user?.email} • {user?.phone || 'Téléphone non renseigné'}
            </p>
            {user?.agency?.name && <p className="text-xs text-slate-400 mt-0.5">{user.agency.name}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/deposer"
            className="bg-[#F5A623] hover:bg-[#E29512] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer une annonce</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </span>
          <button onClick={loadAll} className="font-bold underline shrink-0">
            Réessayer
          </button>
        </div>
      )}

      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">{actionError}</div>
      )}

      {/* Statistiques fournies par l'API */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Mes annonces</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Vues totales</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">
            {new Intl.NumberFormat('fr-FR').format(stats.views)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Contacts reçus</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">{stats.contacts}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Demandes non lues</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">{newCount}</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-slate-200 flex gap-6">
        {[
          { id: 'properties', label: `Mes annonces (${stats.total})` },
          { id: 'inquiries', label: `Demandes reçues${newCount > 0 ? ` (${newCount} nouvelles)` : ''}` },
        ].map((tab) => (
          <button
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

      {/* Onglet : mes annonces */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-slate-500">Chargement de vos annonces…</p>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => {
                  const badge = STATUS_BADGES[property.status] || {
                    label: property.status,
                    className: 'bg-slate-50 text-slate-600 border-slate-200',
                  };
                  const editable = property.status === 'draft' || property.status === 'rejected';
                  const busy = busyKey === `prop-${property.reference}`;

                  return (
                    <div
                      key={property.reference}
                      className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-slate-400">Réf : {property.reference}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{property.title || 'Annonce sans titre'}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {property.city || 'Ville non renseignée'} — {property.neighborhood || 'Quartier non renseigné'}
                        </p>
                        <div className="text-lg font-black text-[#0A1931] mt-2">{formatPrice(property)}</div>

                        {(property.status === 'rejected' || property.status === 'suspended') && property.rejection_reason && (
                          <p className="mt-3 text-xs bg-rose-50 border border-rose-100 text-rose-700 rounded-lg p-2.5">
                            <span className="font-bold">Motif : </span>
                            {property.rejection_reason}
                          </p>
                        )}
                        {property.status === 'pending' && (
                          <p className="mt-3 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg p-2.5">
                            Votre annonce est en cours d'examen par notre équipe.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> {property.views_count || 0} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> {property.contacts_count || 0} contacts
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {editable && (
                            <Link
                              to={`/deposer/${property.reference}`}
                              className="text-[#0A1931] font-semibold hover:underline flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{property.status === 'rejected' ? 'Corriger' : 'Reprendre'}</span>
                            </Link>
                          )}
                          {property.status === 'published' && (
                            <Link
                              to={`/properties/${property.reference}`}
                              className="text-amber-600 font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Voir</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                          {editable && (
                            <button
                              onClick={() => handleDelete(property)}
                              disabled={busy}
                              className="text-rose-600 font-semibold hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Supprimer</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {propsPage.current < propsPage.last && (
                <div className="text-center">
                  <button
                    onClick={() => loadMore('properties')}
                    disabled={loadingMore}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2 rounded-lg text-xs disabled:opacity-50"
                  >
                    {loadingMore ? 'Chargement…' : 'Voir plus d\'annonces'}
                  </button>
                </div>
              )}
            </>
          ) : (
            !error && (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
                <Building className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-600 text-sm font-semibold">Vous n'avez pas encore d'annonce.</p>
                <Link
                  to="/deposer"
                  className="inline-block bg-[#F5A623] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Déposer mon premier bien
                </Link>
              </div>
            )
          )}
        </div>
      )}

      {/* Onglet : demandes reçues */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-slate-500">Chargement des demandes…</p>
          ) : inquiries.length > 0 ? (
            <>
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {inquiries.map((inquiry) => {
                  const status = INQUIRY_STATUS[inquiry.status] || INQUIRY_STATUS.new;
                  const busy = busyKey === `inq-${inquiry.id}`;

                  return (
                    <div key={inquiry.id} className="p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{inquiry.name}</span>
                          <span className="text-slate-400">{INQUIRY_TYPES[inquiry.type] || inquiry.type}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold border ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <span className="text-slate-400">
                          {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString('fr-FR') : ''}
                        </span>
                      </div>

                      {inquiry.property && (
                        <p className="text-[11px] text-slate-500">
                          Bien : <span className="font-mono font-bold">{inquiry.property.reference}</span>
                          {inquiry.property.title ? ` — ${inquiry.property.title}` : ''}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                        {inquiry.phone && (
                          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:underline">
                            <Phone className="w-3 h-3" /> {inquiry.phone}
                          </a>
                        )}
                        {inquiry.email && (
                          <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:underline">
                            <Mail className="w-3 h-3" /> {inquiry.email}
                          </a>
                        )}
                      </div>

                      {inquiry.visit_at && (
                        <p className="text-xs font-semibold text-[#0A1931]">
                          Visite souhaitée le{' '}
                          {new Date(inquiry.visit_at).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                      )}

                      {inquiry.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {inquiry.message}
                        </p>
                      )}

                      <div className="flex gap-3 text-xs">
                        {inquiry.status === 'new' && (
                          <button
                            onClick={() => updateInquiry(inquiry, 'read')}
                            disabled={busy}
                            className="font-semibold text-[#0A1931] hover:underline disabled:opacity-50"
                          >
                            Marquer comme lu
                          </button>
                        )}
                        {inquiry.status !== 'handled' && (
                          <button
                            onClick={() => updateInquiry(inquiry, 'handled')}
                            disabled={busy}
                            className="font-semibold text-emerald-700 hover:underline disabled:opacity-50"
                          >
                            Marquer comme traité
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {inqPage.current < inqPage.last && (
                <div className="text-center">
                  <button
                    onClick={() => loadMore('inquiries')}
                    disabled={loadingMore}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2 rounded-lg text-xs disabled:opacity-50"
                  >
                    {loadingMore ? 'Chargement…' : 'Voir plus de demandes'}
                  </button>
                </div>
              )}
            </>
          ) : (
            !error && (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                Aucune demande reçue pour l'instant.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}