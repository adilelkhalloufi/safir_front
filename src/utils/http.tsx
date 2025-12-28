import { Store } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { logout } from '../store/slices/adminSlice';
import i18next from '../i18n';

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

export const defaultHttp = axios.create();
const http = axios.create();
const currentLang = i18next.language || 'fr';

http.interceptors.request.use(
  (config) => {

    // Priority 1: Add X-Locale header (highest priority in backend)


    // Priority 2: Add lang query parameter (optional, as fallback)
    config.params = {
      ...config.params,
      lang: currentLang,
    };
    const state: RootState = store.getState();

    const apiToken = state.admin?.token;
    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
      config.headers['X-Locale'] = currentLang;
      config.headers['Accept-Language'] = currentLang;
      config.params = {
        ...config.params,
      }

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default http;