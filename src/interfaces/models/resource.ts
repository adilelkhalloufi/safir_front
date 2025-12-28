// Resource model types

export type ResourceType = 'room' | 'chair' | 'wash_station' | 'hammam' | 'other';
export type ResourceStatus = 'available' | 'occupied' | 'maintenance' | 'unavailable';

export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  capacity?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceFormData {
  name: string;
  type: ResourceType;
  status?: ResourceStatus;
  capacity?: number;
  description?: string;
  is_active?: boolean;
}
