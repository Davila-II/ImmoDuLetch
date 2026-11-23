import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Building, Eye, MessageSquare, Plus, LogOut, CheckCircle, 
  Clock, AlertCircle, Trash2, Edit3, ExternalLink 
} from 'lucide-react';

export default function AccountDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [propsRes, inqRes] = await Promise.all([
          api.get('/my/properties').catch(() => ({ data: { data: [] } })),
          api.get('/my/inquiries').catch(() => ({ data: { data: [] } }))
        ]);
        setProperties(propsRes.data.data || propsRes.data || []);
        setInquiries(inqRes.data.data || inqRes.data || []);
      } catch (err) {
        console.error('Erreur chargement dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">Publiée</span>;
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-200">En validation</span>;
      case 'draft':
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-slate-300">Brouillon</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profil (Inspiré de screen (14/15).png) */}
      <div className="bg-[#0A1931] text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ID'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold">{user?.name}</h1>
              <span className="bg-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-amber-300/30">
                {user?.user_type === 'agency' ? 'Compte Agence Certifié' : 'Compte Particulier'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{user?.email} • {user?.phone || 'Téléphone non renseigné'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/submit"
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

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Mes Annonces</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">{properties.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Demandes Reçues</span>
          <div className="text-2xl font-black text-[#0A1931] mt-1">{inquiries.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500">Statut du Compte</span>
          <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Vérifié &amp; Actif
          </div>
        </div>
      </div>

      {/* Tabs : Mes Annonces / Boîte de Réception */}
      <div className="border-b border-slate-200 flex gap-6">
        <button
          onClick={() => setActiveTab('properties')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'properties'
              ? 'border-[#0A1931] text-[#0A1931]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Mes Annonces ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'inquiries'
              ? 'border-[#0A1931] text-[#0A1931]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Demandes reçues ({inquiries.length})
        </button>
      </div>

      {/* CONTENU ONGLET 1 : MES ANNONCES (screen (13).png) */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-slate-500">Chargement de vos annonces...</p>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((prop) => (
                <div key={prop.reference} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Réf : {prop.reference}</span>
                      {getStatusBadge(prop.status)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{prop.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{prop.city} — {prop.neighborhood || 'Quartier'}</p>
                    <div className="text-lg font-black text-[#0A1931] mt-2">
                      {new Intl.NumberFormat('fr-FR').format(prop.price)} FCFA
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {prop.views_count || 0} vues</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {prop.contacts_count || 0} contacts</span>
                    </div>
                    <Link
                      to={`/properties/${prop.reference}`}
                      className="text-amber-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Voir</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 text-sm font-semibold">Vous n'avez pas encore publié d'annonce.</p>
              <Link
                to="/submit"
                className="inline-block bg-[#F5A623] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Déposer mon premier bien
              </Link>
            </div>
          )}
        </div>
      )}

      {/* CONTENU ONGLET 2 : BOÎTE DE RÉCEPTION */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{inq.name} ({inq.phone})</span>
                    <span className="text-slate-400">{inq.created_at ? new Date(inq.created_at).toLocaleDateString('fr-FR') : ''}</span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {inq.message || 'Demande de visite ou de contact'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
              Aucune demande reçue pour l'instant.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
