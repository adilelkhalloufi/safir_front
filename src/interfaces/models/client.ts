// Client/User model types

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  // Statistics
  bookings_count?: number;
  total_spent?: number;
  active_subscriptions_count?: number;
  // Relations
  bookings?: any[];
  subscriptions?: any[];
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  password?: string;
}
