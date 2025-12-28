// Service model types (extended from booking.ts)

export type ServiceType = 'masso' | 'coiffure' | 'hammam' | 'massage' | 'gommage' | 'spa' | 'other';
export type Gender = 'femme' | 'homme' | 'mixte';

export interface Service {
  id: number;
  type_service: ServiceType;
  name: string | { fr: string; en: string; ar?: string };
  description?: string | { fr: string; en: string; ar?: string };
  duration_minutes: number;
  duration?: number; // Alias
  price: string | number;
  requires_room?: boolean;
  requires_chair?: boolean;
  requires_wash_station?: boolean;
  requires_hammam_session?: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  type_service: ServiceType;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  requires_room?: boolean;
  requires_chair?: boolean;
  requires_wash_station?: boolean;
  requires_hammam_session?: boolean;
  is_active?: boolean;
}

// Helper function to get localized value
export function getLocalizedValue(
  value: string | { fr: string; en: string; ar?: string } | undefined,
  language: 'fr' | 'en' | 'ar' = 'fr'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.fr || value.en || '';
}
