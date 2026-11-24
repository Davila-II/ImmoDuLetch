import api from './api';

export const adminService = {
  // Statistiques globales du tableau de bord
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // Liste des annonces pour la modération (avec filtres optionnels : status, category, per_page, page)
  async getProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.set(key, val);
      }
    });
    const res = await api.get(`/admin/properties?${query.toString()}`);
    return res.data;
  },

  // Détail d'une annonce spécifique
  async getProperty(reference) {
    const res = await api.get(`/admin/properties/${reference}`);
    return res.data?.data || res.data;
  },

  // Approuver une annonce en attente -> publiée
  async approveProperty(reference) {
    const res = await api.post(`/admin/properties/${reference}/approve`);
    return res.data?.data || res.data;
  },

  // Rejeter une annonce avec un motif obligatoire -> refusée
  async rejectProperty(reference, reason) {
    const res = await api.post(`/admin/properties/${reference}/reject`, { reason });
    return res.data?.data || res.data;
  },

  // Suspendre une annonce publiée -> suspendue
  async suspendProperty(reference, reason) {
    const res = await api.post(`/admin/properties/${reference}/suspend`, { reason });
    return res.data?.data || res.data;
  },

  // Rétablir une annonce suspendue -> publiée
  async reinstateProperty(reference) {
    const res = await api.post(`/admin/properties/${reference}/reinstate`);
    return res.data?.data || res.data;
  },

  // Modifier les mises en avant (is_exclusive, is_featured)
  async updateFlags(reference, { is_exclusive, is_featured }) {
    const res = await api.patch(`/admin/properties/${reference}/flags`, { is_exclusive, is_featured });
    return res.data?.data || res.data;
  },

  // Gestion des agences
  async getAgencies() {
    const res = await api.get('/admin/agencies');
    return res.data?.data || res.data || [];
  },

  async createAgency(data) {
    const res = await api.post('/admin/agencies', data);
    return res.data?.data || res.data;
  },

  async updateAgency(id, data) {
    const res = await api.patch(`/admin/agencies/${id}`, data);
    return res.data?.data || res.data;
  },

  async addAgencyMember(agencyId, userId, isAgencyAdmin = false) {
    const res = await api.post(`/admin/agencies/${agencyId}/members`, {
      user_id: userId,
      is_agency_admin: isAgencyAdmin,
    });
    return res.data?.data || res.data;
  },

  async removeAgencyMember(agencyId, userId) {
    const res = await api.delete(`/admin/agencies/${agencyId}/members/${userId}`);
    return res.data;
  },

  // Utilisateurs
  async getUsers(params = {}) {
    const query = new URLSearchParams(params);
    const res = await api.get(`/admin/users?${query.toString()}`);
    return res.data;
  },
};
