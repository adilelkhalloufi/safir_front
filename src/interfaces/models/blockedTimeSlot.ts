// Blocked Time Slots model types

export type BlockedSlotType = 'staff' | 'service' | 'facility';
export type BlockedSlotReason = 'sick_leave' | 'maintenance' | 'reserved_event' | 'holiday' | 'training' | 'urgent_closure';

export interface StaffProfile {
  id: number;
  name: string;
  specialization?: string;
}

export interface BlockedTimeSlot {
  id: number;
  type: BlockedSlotType;
  staff_profile_id?: number;
  staff_profile?: StaffProfile;
  service_id?: number;
  start_datetime: string;
  end_datetime: string;
  reason?: BlockedSlotReason;
  description?: string;
  created_by?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedTimeSlotFormData {
  type: BlockedSlotType;
  staff_profile_id?: number;
  service_id?: number;
  start_datetime: string;
  end_datetime: string;
  reason?: BlockedSlotReason;
  description?: string;
  is_active?: boolean;
}

export interface BlockedTimeSlotsResponse {
  data: BlockedTimeSlot[];
  links?: any;
  meta?: {
    total: number;
    per_page: number;
  };
}
