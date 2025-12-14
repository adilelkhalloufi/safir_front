// Booking wizard specific types
export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  notes?: string
}
