import { ServiceType } from "./serviceType";

 

export interface Service {
  id?: number
  type_service?: ServiceType
  name?: string | { fr: string; en: string; ar?: string }  // Support both string and multilingual object
  description?: string | { fr: string; en: string; ar?: string }  // Support both string and multilingual object
  duration_minutes?: number
  duration?: number  // Alias for compatibility
  price?: string | number  // Support both string and number
  
  requires_room?: boolean
  requires_chair?: boolean
  requires_wash_station?: boolean
  requires_hammam_session?: boolean
  is_active?: boolean
  
}

// Helper function to get localized value
export function getLocalizedValue(value: string | { fr: string; en: string; ar?: string } | undefined, language: 'fr' | 'en' | 'ar' = 'fr'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[language] || value.fr || value.en || ''
}

export interface Staff {
  id?: number
  user_id?: number
  name?: string
  type_staff?: any
  default_break_minutes?: number
  is_active?: boolean
  services?: Service[]
  availabilities?: {
    day_of_week?: number
    start_time?: string
    end_time?: string
  }[]
}

export interface HammamSession {
  id?: number
  date?: string
  time?: string
  type_session?: any
  capacity_total?: number
  capacity_served?: number
  capacity_autonomous?: number
  current_served?: number
  current_autonomous?: number
  available_served?: number
  available_autonomous?: number
  is_full?: boolean
  is_active?: boolean
}

export interface AvailabilityServiceDetail {
  service_id?: number
  service_name?: string
  order_index?: number
  start_datetime?: string
  end_datetime?: string
  staff_id?: number
  staff_name?: string
  room_id?: number
  room_name?: string
  hammam_session_id?: number
  session_type?: any
  available_capacity?: number
  price?: string
}

export interface AvailabilityScenario {
  scenario_id?: string
  start_datetime?: string
  end_datetime?: string
  total_duration_minutes?: number
  total_duration?: number  // Alias for compatibility
  total_price?: string | number  // Support both string and number
  services?: AvailabilityServiceDetail[]
  service_type?: ServiceType  // For service-specific availability
  service_id?: number  // For service-specific availability
}

export interface AvailabilityResponse {
  data?: AvailabilityScenario[]
  meta?: {
    date?: string
    total_scenarios?: number
  }
}

export interface BookingServiceRequest {
  service_id?: number
  order_index?: number
}

export interface AvailabilityRequest {
  services?: BookingServiceRequest[]
  date?: string
  group_size?: number
  any?: any
  preferred_staff_id?: number
}

export interface BookingItemRequest {
  service_id?: number
  order_index?: number
  start_datetime?: string
  staff_id?: number
  room_id?: number
  hammam_session_id?: number
  is_served?: boolean
  notes?: string
}

export interface CreateBookingRequest {
  client_id?: number
  language?: string
  group_size?: number
  notes?: string
  services?: any[]
  payment_method_id?: number
}

export interface BookingItem {
  id?: number
  booking_id?: number
  service_id?: number
  service_name?: string
  staff_id?: number
  staff_name?: string
  start_datetime?: string
  end_datetime?: string
  room_id?: number
  room_name?: string
  hammam_session_id?: number
  hammam_session_type?: any
  price?: string
  order_index?: number
}

export interface Booking {
  id?: number
  client_id?: number
  status?: any
  language?: string
  group_size?: number
  notes?: string
  created_by?: number
  created_at?: string
  cancelled_at?: string
  cancellation_reason?: string
  items?: BookingItem[]
  total_amount?: string
  payment_authorization?: {
    id?: number
    amount?: string
    status?: string
    square_payment_id?: string
  }
  can_cancel?: boolean
  can_modify?: boolean
}

// Guest Booking API types
export interface GuestInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface CreateGuestBookingRequest {
  guest_info: GuestInfo
  service_ids: number[]
  start_datetime: string
  group_size?: number
  any_preference?: 'female' | 'male' | 'mixed'
  notes?: string
  language?: 'en' | 'fr'
}

export interface ConfirmBookingRequest {
  payment_method: 'card' | 'cash' | 'other'
  cardholder_name?: string
  card_last4?: string
}

export interface AvailabilitySlot {
  start_time: string
  end_time: string
  start_datetime: string
  end_datetime: string
  services_breakdown: {
    service_id: number
    service_name: string
    duration: number
    start_time: string
    end_time: string
    staff_id: number
    staff_name: string
  }[]
  available_staff: {
    staff_id: number
    staff_name: string
    specialization: string
    type_staff: {
      id: number
      name_en: string
      name_fr: string
    }
    work_hours: {
      start: string
      end: string
    }
  }[]
}

// Transformed slot for SelectDateTime component
export interface TransformedSlot {
  date: string
  time: string
  datetime: string
  available: boolean
  staff_id?: number
  staff_name?: string
  session_type?: string
  available_capacity?: number
}

export interface AvailabilitySlotsRequest {
  service_ids: number[]
  start_date: string
  end_date: string
  group_size?: number
  any_preference?: 'female' | 'male' | 'mixed'
}

export interface AvailabilitySlotsResponse {
  success: boolean
  message: string
  data: {
    slots: AvailabilitySlot[]
    total_slots: number
  }
}

export interface GuestBookingResponse {
  success: boolean
  message: string
  data: {
    id: number
    booking_reference: string
    status: string
    guest: GuestInfo
    start_datetime: string
    end_datetime: string
    group_size: number
    language: string
    items: {
      service_id: number
      service_name: string
      start_datetime: string
      end_datetime: string
      duration_minutes: number
      price: string
    }[]
    total_amount: string
    expires_at?: string
    confirmation_required?: boolean
    confirmed_at?: string
    can_cancel?: boolean
    cancellation_policy?: {
      can_cancel_until: string
      hours_before: number
    }
  }
}
