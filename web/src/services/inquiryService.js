import api from './api';

export const inquiryService = {
  async send(reference, payload) {
    const { data } = await api.post(`/properties/${reference}/inquiries`, payload);
    return data;
  },

  // Clic « WhatsApp » ou « Appeler » : alimente le compteur de contacts du propriétaire.
  // Silencieux : un échec ne doit jamais empêcher d'ouvrir WhatsApp.
  track(reference, type) {
    api.post(`/properties/${reference}/inquiries`, { type }).catch(() => {});
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/my/inquiries/${id}`, { status });
    return data.data;
  },
};