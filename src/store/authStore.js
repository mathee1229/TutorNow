import { create } from 'zustand';
import { apiRequest } from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('tutornow_token') || null,
  isLoading: true,

  initialize: async () => {
    const token = localStorage.getItem('tutornow_token');
    if (!token) {
      set({ user: null, token: null, isLoading: false });
      return;
    }

    try {
      const data = await apiRequest('/auth/me');
      set({ user: data, token, isLoading: false });
    } catch (err) {
      localStorage.removeItem('tutornow_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('tutornow_token', data.token);
    set({ user: data, token: data.token });
    return data;
  },

  register: async (payload) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    localStorage.setItem('tutornow_token', data.token);
    set({ user: data, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('tutornow_token');
    set({ user: null, token: null });
  }
}));
