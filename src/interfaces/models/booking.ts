// Booking API Types based on Laravel backend

export type ServiceType = 'masso' | 'coiffure' | 'hammam'
export type Gender = 'femme' | 'homme' | 'mixte'
export type BookingStatus = 'draft' | 'confirmed' | 'cancelled' | 'no_show' | 'completed'
export type StaffType = 'masso' | 'coiffure' | 'hammam'

export interface Service {
  id: number
  type_service: ServiceType
  name: string
  description: string
  duration_minutes: number
  price: string
  requires_room: boolean
  requires_chair: boolean
  requires_wash_station: boolean
  requires_hammam_session: boolean
  is_active: boolean
}

export interface Staff {
  id: number
  user_id: number
  name: string
  type_staff: StaffType
  default_break_minutes: number
  is_active: boolean
  services: Service[]
  availabilities: {
    day_of_week: number
    start_time: string
    end_time: string
  }[]
}

export interface HammamSession {
  id: number
  date: string
  time: string
  type_session: Gender
  capacity_total: number
  capacity_served: number
  capacity_autonomous: number
  current_served: number
  current_autonomous: number
  available_served: number
  available_autonomous: number
  is_full: boolean
  is_active: boolean
}

export interface AvailabilityServiceDetail {
  service_id: number
  service_name: string
  order_index: number
  start_datetime: string
  end_datetime: string
  staff_id?: number
  staff_name?: string
  room_id?: number
  room_name?: string
  hammam_session_id?: number
  session_type?: Gender
  available_capacity?: number
  price: string
}

export interface AvailabilityScenario {
  scenario_id: string
  start_datetime: string
  end_datetime: string
  total_duration_minutes: number
  total_price: string
  services: AvailabilityServiceDetail[]
}

export interface AvailabilityResponse {
  data: AvailabilityScenario[]
  meta: {
    date: string
    total_scenarios: number
  }
}

export interface BookingServiceRequest {
  service_id: number
  order_index: number
}

export interface AvailabilityRequest {
  services: BookingServiceRequest[]
  date: string
  group_size: number
  gender?: Gender
  preferred_staff_id?: number
}

export interface BookingItemRequest {
  service_id: number
  order_index: number
  start_datetime: string
  staff_id?: number
  room_id?: number
  hammam_session_id?: number
  is_served?: boolean
  notes?: string
}

export interface CreateBookingRequest {
  client_id?: number
  language: string
  group_size: number
  notes?: string
  services: BookingItemRequest[]
  payment_method_id?: number
}

export interface BookingItem {
  id: number
  booking_id: number
  service_id: number
  service_name: string
  staff_id?: number
  staff_name?: string
  start_datetime: string
  end_datetime: string
  room_id?: number
  room_name?: string
  hammam_session_id?: number
  hammam_session_type?: Gender
  price: string
  order_index: number
}

export interface Booking {
  id: number
  client_id: number
  status: BookingStatus
  language: string
  group_size: number
  notes?: string
  created_by: number
  created_at: string
  cancelled_at?: string
  cancellation_reason?: string
  items: BookingItem[]
  total_amount: string
  payment_authorization?: {
    id: number
    amount: string
    status: string
    square_payment_id: string
  }
  can_cancel?: boolean
  can_modify?: boolean
}
