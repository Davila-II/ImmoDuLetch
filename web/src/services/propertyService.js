import api from './api';

export const propertyService = {
  async get(reference) {
    const { data } = await api.get(`/properties/${reference}`);
    return data.data;
  },

  async similar(reference) {
    const { data } = await api.get(`/properties/${reference}/similar`);
    return data.data;
  },

  async remove(reference) {
    await api.delete(`/my/properties/${reference}`);
  },

  async setFavorite(reference, favorite) {
    if (favorite) await api.put(`/properties/${reference}/favorite`);
    else await api.delete(`/properties/${reference}/favorite`);
  },
};