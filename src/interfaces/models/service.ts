// Service model types (extended from booking.ts)

 export type Gender = 'femme' | 'homme' | 'mixte';

export interface ServiceTypeObject {
  id: number;
  name: { en: string; fr: string; ar?: string };
  color: string;
  is_active: boolean;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  type: ServiceTypeObject;
  name: { fr: string; en: string; ar?: string };
  description: { fr: string | null; en: string | null; ar?: string | null };
  duration_minutes: number;
  buffer_minutes: number;
  requires_health_form: boolean;
  has_sessions: boolean;
  price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Additional fields for booking context
  preferred_gender?: Gender;
  quntity?: number; // Note: 'quntity' is for person count in booking context
  
}

 

 