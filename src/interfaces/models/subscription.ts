// Subscription model types

import { Service } from './booking';

export type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

export interface Subscription {
  id: number;
  user_id?: number;
  name: string;
  description?: string;
  total_sessions: number;
  used_sessions: number;
  remaining_sessions?: number;
  validity_days: number;
  price: string | number;
  status: SubscriptionStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  services?: Service[];
  bookings?: any[];
}

export interface SubscriptionFormData {
  name: string;
  description?: string;
  total_sessions: number;
  validity_days: number;
  price: number;
  service_ids?: number[];
}

export interface SubscriptionStats {
  total_active: number;
  expiring_soon: number;
  monthly_revenue: number;
  average_sessions: number;
}
