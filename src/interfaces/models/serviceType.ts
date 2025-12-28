// Service Type model types

export interface ServiceType {
  id: number;
  name: string;
  code: string; // 'masso', 'coiffure', 'hammam', 'massage', 'gommage', 'spa'
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  // Relations
  services_count?: number;
}

export interface ServiceTypeFormData {
  name: string;
  code: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
  display_order?: number;
}
