export interface AnalyticsPeriod {
  start_date: string;
  end_date: string;
}

export interface AnalyticsBookings {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface AnalyticsRevenue {
  total: number;
  average_booking_value: number;
}

export interface AnalyticsClients {
  total: number;
  active_in_period: number;
}

export interface AnalyticsSubscriptions {
  total: number;
  active: number;
  sessions_sold: number;
  sessions_used: number;
  revenue: number;
}

export interface ServiceTypeAnalytics {
  service_type_id: number;
  service_type_name_en: string;
  service_type_name_fr: string;
  bookings_count: number;
  revenue: number;
}

export interface ServiceAnalytics {
  service_id: number;
  service_name: string;
  service_type_id: number;
  bookings_count: number;
  revenue: number;
}

export interface DailyBreakdown {
  date: string;
  bookings_count: number;
  revenue: number;
}

export interface AnalyticsResponse {
  period: AnalyticsPeriod;
  bookings: AnalyticsBookings;
  revenue: AnalyticsRevenue;
  clients: AnalyticsClients;
  subscriptions: AnalyticsSubscriptions;
  service_types: ServiceTypeAnalytics[];
  services: ServiceAnalytics[];
  daily_breakdown: DailyBreakdown[];
}
