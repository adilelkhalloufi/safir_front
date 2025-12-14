import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster as UIToaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner' // Add explicit import for Sonner's Toaster
import { ThemeProvider } from '@/components/theme-provider'
import { browserRouter } from './routes/browserRouter'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store'
import { injectStore } from './utils/http';
import Loader from './components/loader';
import {
  QueryClient,
  QueryClientProvider,
 
} from '@tanstack/react-query'

import '@/index.css'
import "@/map.css"
import i18next from "./i18n";

i18next.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});
document.documentElement.setAttribute('dir', i18next.language === 'ar' ? 'rtl' : 'ltr');

const persistor = persistStore(store);
injectStore(store);
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <PersistGate loading={<Loader />} persistor={persistor}>
                <RouterProvider router={browserRouter} />
            </PersistGate>
        </Provider>
      </QueryClientProvider>
      <UIToaster />
      <SonnerToaster position="top-right" richColors /> {/* Add Sonner Toaster */}
    </ThemeProvider>
  </React.StrictMode>
)
