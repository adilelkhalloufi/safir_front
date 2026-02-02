import { combineReducers, configureStore } from '@reduxjs/toolkit';
import adminSlice, { AdminState } from './slices/adminSlice';
import bookingSlice, { BookingState } from './slices/bookingSlice';
import settingsSlice, { SettingsState } from './slices/settingsSlice';



import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { CONFIG } from '@/CONFIG';

const persistConfig = {
  key: CONFIG.APP_NAME,
  storage,
};

const rootReducer = combineReducers({
  admin: adminSlice,
  booking: bookingSlice,
  settings: settingsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  admin: AdminState;
  booking: BookingState;
  settings: SettingsState;
};
export type AppDispatch = typeof store.dispatch;