import api from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { user, token }
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data; // { user, token }
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  },
};