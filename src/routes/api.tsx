import { API_URL } from '../utils';

export const apiRoutes = {
  // ... other routes ...
  login: `${API_URL}/login`,
  logout: `${API_URL}/logout`,
  register: `${API_URL}/register`,
  users: `${API_URL}/user`,
  dashboard: `${API_URL}/dashboard`,
  

  // Booking API
  services: `${API_URL}/services`,
  staff: `${API_URL}/staff`,
  availability: `${API_URL}/availability/multi-service`,
  hammamSessions: `${API_URL}/hammam/sessions`,
  bookings: `${API_URL}/bookings`,
  resources: `${API_URL}/resources/availability`,
};
