

export const webRoutes = {
  home: '/',
  login: '/login',
  register: '/register',
  clear: '/clear',
  logout: '/logout',
  Dashboard: '/Dashbord',
  booking: '/booking',

  // Admin routes
  bookings: {
    index: '/dashboard/bookings',
    view: '/dashboard/bookings/:id',
    add: '/dashboard/bookings/add',
    edit: '/dashboard/bookings/:id/edit',
  },
  clients: {
    index: '/dashboard/clients',
    view: '/dashboard/clients/:id',
    add: '/dashboard/clients/add',
    edit: '/dashboard/clients/:id/edit',
  },
  subscriptions: {
    index: '/dashboard/subscriptions',
    view: '/dashboard/subscriptions/:id',
    add: '/dashboard/subscriptions/add',
    edit: '/dashboard/subscriptions/:id/edit',
  },
  healthForms: {
    index: '/dashboard/health-forms',
    view: '/dashboard/health-forms/:id',
    pending: '/dashboard/health-forms/pending',
  },
  staff: {
    index: '/dashboard/staff',
    calendar: '/dashboard/staff/calendar',
    view: '/dashboard/staff/:id',
    add: '/dashboard/staff/add',
    edit: '/dashboard/staff/:id/edit',
  },
  services: {
    index: '/dashboard/services',
    view: '/dashboard/services/:id',
    add: '/dashboard/services/add',
    edit: '/dashboard/services/:id/edit',
  },
  typeServices: {
    index: '/dashboard/type-services',
    view: '/dashboard/type-services/:id',
    add: '/dashboard/type-services/add',
    edit: '/dashboard/type-services/:id/edit',
  },
  resources: {
    index: '/dashboard/resources',
    view: '/dashboard/resources/:id',
    add: '/dashboard/resources/add',
    edit: '/dashboard/resources/:id/edit',
  },
  typeResources: {
    index: '/dashboard/type-resources',
    view: '/dashboard/type-resources/:id',
    add: '/dashboard/type-resources/add',
    edit: '/dashboard/type-resources/:id/edit',
  },
  payments: {
    index: '/dashboard/payments',
    add: '/dashboard/payments/add',
    view: '/dashboard/payments/:id',
  },
  reports: {
    index: '/dashboard/reports',
  },
  settings: {
    index: '/dashboard/settings',
  },
  profile: {
    index: '/dashboard/profile',
  },
};

