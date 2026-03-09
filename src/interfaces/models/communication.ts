export interface Communication {
  id: number;
  booking_id: number;
  channel: 'email' | 'sms';
  to: string;
  subject?: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  error_message?: string;
  sent_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CommunicationStatistics {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  by_channel: {
    email: number;
    sms: number;
  };
}
