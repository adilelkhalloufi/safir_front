import { API_URL } from '../utils';

export const apiRoutes = {
  // ... other routes ...
  login: `${API_URL}/login`,
  logout: `${API_URL}/logout`,
  register: `${API_URL}/register`,
  users: `${API_URL}/user`,
  dashboard: `${API_URL}/dashboard`,

  // Admin Dashboard API
  adminStatistics: `${API_URL}/admin/statistics`,
  adminRevenueStats: `${API_URL}/admin/statistics/revenue`,
  todayBookings: `${API_URL}/admin/bookings?date=today`,

  // Admin API
  adminBookings: `${API_URL}/admin/bookings`,
  adminBookingById: (id: number) => `${API_URL}/admin/bookings/${id}`,
  adminBookingCancel: (id: number) => `${API_URL}/admin/bookings/${id}/cancel`,
  adminBookingComplete: (id: number) => `${API_URL}/admin/bookings/${id}/complete`,
  adminBookingNoShow: (id: number) => `${API_URL}/admin/bookings/${id}/no-show`,

  adminClients: `${API_URL}/admin/clients`,
  adminClientById: (id: number) => `${API_URL}/admin/clients/${id}`,
  adminClientNote: (id: number) => `${API_URL}/admin/clients/${id}/note`,

  adminSubscriptions: `${API_URL}/admin/subscriptions`,
  adminSubscriptionById: (id: number) => `${API_URL}/admin/subscriptions/${id}`,
  adminSubscriptionSuspend: (id: number) => `${API_URL}/admin/subscriptions/${id}/suspend`,


  adminStaff: `${API_URL}/admin/staff`,
  adminStaffById: (id: number) => `${API_URL}/admin/staff/${id}`,
  adminStaffSchedule: (id: number) => `${API_URL}/admin/staff/${id}/schedule`,
  adminStaffAvailability: (id: number) => `${API_URL}/admin/staff/${id}/availability`,

  // Calendar API
  calendarWeekly: `${API_URL}/calendar/weekly`,
  calendarDay: `${API_URL}/calendar/day`,

  adminServices: `${API_URL}/admin/services`,
  adminServiceById: (id: number) => `${API_URL}/admin/services/${id}`,

  adminServiceTypes: `${API_URL}/admin/types`,
  adminServiceTypeById: (id: number) => `${API_URL}/admin/types/${id}`,

  adminResources: `${API_URL}/admin/resources`,
  adminResourceById: (id: number) => `${API_URL}/admin/resources/${id}`,
  adminResourceStatus: (id: number) => `${API_URL}/admin/resources/${id}/status`,
  adminResourceSchedule: (id: number) => `${API_URL}/admin/resources/${id}/schedule`,

  adminTypeResources: `${API_URL}/admin/type-resources`,
  adminTypeResourceById: (id: number) => `${API_URL}/admin/type-resources/${id}`,


  adminPayments: `${API_URL}/admin/payments`,
  adminPaymentById: (id: number) => `${API_URL}/admin/payments/${id}`,
  adminPaymentRefund: (id: number) => `${API_URL}/admin/payments/${id}/refund`,
  adminPaymentSummary: `${API_URL}/admin/payments/summary`,

  adminReports: `${API_URL}/admin/reports`,
  adminAnalytics: `${API_URL}/admin/analytics`,
  adminStaffPerformance: `${API_URL}/admin/reports/staff-performance`,
  adminServiceStats: `${API_URL}/admin/reports/service-stats`,

  adminSettings: `${API_URL}/admin/settings`,

  // Booking API
  services: `${API_URL}/services`,
  servicesByType: (type: string) => `${API_URL}/services/type/${type}`,
  serviceById: (id: number) => `${API_URL}/services/${id}`,
  staff: `${API_URL}/staff`,
  availabilitySlots: `${API_URL}/availability/slots`,
  availability: `${API_URL}/availability/multiple-services`,
  hammamSessions: `${API_URL}/hammam/sessions`,
  bookings: `${API_URL}/bookings`,
  guestBookings: `${API_URL}/guest-bookings`,
  guestBookingById: (id: number) => `${API_URL}/guest-bookings/${id}`,
  confirmGuestBooking: (id: number) => `${API_URL}/guest-bookings/${id}/confirm`,
  cancelGuestBooking: (id: string) => `${API_URL}/guest-bookings/${id}/cancel`,
  healthFormBooking: (id: string) => `${API_URL}/guest-bookings/${id}/health-form`,
  resources: `${API_URL}/resources/availability`,
};
