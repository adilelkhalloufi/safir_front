import { Store } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { logout } from '../store/slices/adminSlice';

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

export const defaultHttp = axios.create();
const http = axios.create();

http.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState();
 
    const apiToken = state.admin?.token;
    const storeId = state.setting?.store ? state.setting.store.id : null;
     if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
      config.params = {
        ...config.params,
        store_id : storeId
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