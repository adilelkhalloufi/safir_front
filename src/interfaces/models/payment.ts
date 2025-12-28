// Payment model types

export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'bank_transfer' | 'mobile';

export interface Payment {
  id: number;
  booking_id?: number;
  user_id?: number;
  amount: number;
  status: PaymentStatus;
  payment_method?: PaymentMethod;
  transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  refunded_at?: string;
  // Relations
  booking?: {
    id: number;
    start_datetime: string;
    status: string;
    total_price?: number;
  };
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentFormData {
  amount: number;
  payment_method: PaymentMethod;
  booking_id?: number;
}

export interface RefundData {
  amount: number;
  reason: string;
}
