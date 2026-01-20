import { Service } from "./service";


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

 
export interface ServiceRequestAvalilabilitySearch {
  service_id?: number
  group_size?: number
  any_preference?: 'female' | 'male' | 'mixed'


}
export interface AvailabilitySlotsRequest {
  services: ServiceRequestAvalilabilitySearch[]
  date: string
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
