// Staff model types

import { Service } from './service';

export type StaffType = 'masso' | 'coiffure' | 'hammam';

export interface Staff {
  id: number;
  user_id?: number;
  name: string;
  type_staff: StaffType;
  default_break_minutes?: number;
  is_active: boolean;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  services?: Service[];
  availabilities?: StaffAvailability[];
}

export interface StaffAvailability {
  id?: number;
  staff_id?: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_active?: boolean;
}

export interface StaffFormData {
  name: string;
  type_staff: StaffType;
  email?: string;
  phone?: string;
  default_break_minutes?: number;
  is_active?: boolean;
  service_ids?: number[];
}
