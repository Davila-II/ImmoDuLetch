import { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import ModerationQueue from '../components/admin/ModerationQueue';
import AgencyManagement from '../components/admin/AgencyManagement';
import Alert from '../components/ui/Alert';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('moderation');
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [error, setError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  // Charger les statistiques globales
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erreur chargement stats admin', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Charger les annonces selon le filtre de statut
  const loadProperties = async (status = statusFilter) => {
    try {
      setLoadingProps(true);
      setError(null);
      const res = await adminService.getProperties({ status, per_page: 30 });
      setProperties(res.data || []);
    } catch (err) {
      console.error('Erreur modération annonces', err);
      setError('Impossible de charger les annonces à modérer.');
    } finally {
      setLoadingProps(false);
    }
  };

  // Charger les agences
  const loadAgencies = async () => {
    try {
      setLoadingAgencies(true);
      const data = await adminService.getAgencies();
      setAgencies(data);
    } catch (err) {
      console.error('Erreur agences admin', err);
    } finally {
      setLoadingAgencies(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadProperties('pending');
  }, []);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    loadProperties(status);
  };

  const handleApprove = async (reference) => {
    setBusyKey(reference);
    try {
      await adminService.approveProperty(reference);
      loadProperties(statusFilter);
      loadStats();
    } catch (err) {
      alert("Erreur lors de l'approbation de l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleReject = async (reference, reason) => {
    setBusyKey(reference);
    try {
      await adminService.rejectProperty(reference, reason);
      loadProperties(statusFilter);
      loadStats();
    } catch (err) {
      alert("Erreur lors du rejet de l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleSuspend = async (reference) => {
    if (!window.confirm(`Suspendre la publication de l'annonce ${reference} ?`)) return;
    setBusyKey(reference);
    try {
      await adminService.suspendProperty(reference, 'Suspendu par modération.');
      loadProperties(statusFilter);
      loadStats();
    } catch (err) {
      alert("Erreur lors de la suspension de l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleReinstate = async (reference) => {
    setBusyKey(reference);
    try {
      await adminService.reinstateProperty(reference);
      loadProperties(statusFilter);
      loadStats();
    } catch (err) {
      alert("Erreur lors du rétablissement de l'annonce.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleToggleFlags = async (reference, flags) => {
    setBusyKey(reference);
    try {
      await adminService.updateFlags(reference, flags);
      loadProperties(statusFilter);
    } catch (err) {
      alert("Erreur lors de la mise à jour des options d'affichage.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleToggleCertification = async (agencyId, isCertified) => {
    setBusyKey(agencyId);
    try {
      await adminService.updateAgency(agencyId, { is_certified: isCertified });
      loadAgencies();
      loadStats();
    } catch (err) {
      alert("Erreur lors du changement de statut de l'agence.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleCreateAgency = async (agencyData) => {
    try {
      await adminService.createAgency(agencyData);
      loadAgencies();
      loadStats();
    } catch (err) {
      alert("Erreur lors de la création de l'agence.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Admin */}
      <div className="bg-[#0A1931] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Panneau d'Administration</h1>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Superviseur
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">Modération cadastrale, validation des annonces et conformité</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            loadStats();
            if (activeTab === 'moderation') loadProperties();
            if (activeTab === 'agencies') loadAgencies();
          }}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {error && (
        <Alert className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </Alert>
      )}

      {/* Cartes de statistiques globales */}
      <AdminStatsCards stats={stats} />

      {/* Navigation Onglets */}
      <div className="border-b border-slate-200 flex gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'moderation'
              ? 'border-[#0A1931] text-[#0A1931]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          File de modération {stats?.pending_properties ? `(${stats.pending_properties} en attente)` : ''}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('agencies');
            if (agencies.length === 0) loadAgencies();
          }}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'agencies'
              ? 'border-[#0A1931] text-[#0A1931]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Agences partenaires {stats?.total_agencies ? `(${stats.total_agencies})` : ''}
        </button>
      </div>

      {/* Contenu Onglet Actif */}
      {activeTab === 'moderation' && (
        <ModerationQueue
          properties={properties}
          loading={loadingProps}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onReinstate={handleReinstate}
          onToggleFlags={handleToggleFlags}
          busyKey={busyKey}
        />
      )}

      {activeTab === 'agencies' && (
        <AgencyManagement
          agencies={agencies}
          loading={loadingAgencies}
          onToggleCertification={handleToggleCertification}
          onCreateAgency={handleCreateAgency}
          busyKey={busyKey}
        />
      )}
    </div>
  );
}
