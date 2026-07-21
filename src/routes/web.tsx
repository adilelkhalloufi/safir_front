

export const webRoutes = {
  home: '/',
  login: '/login',
  register: '/register',
  clear: '/clear',
  logout: '/logout',
  Dashboard: '/Dashbord',
  booking: '/booking',
  subscriptionPlans: '/subscriptions',
  subscriptionCheckout: '/subscriptions/checkout',
  policy: '/policy',
  staffLanding: '/staff',
  cancelBooking: '/booking/:id/cancel',
  healthFormClient: '/booking/:id/health-form',
  reviewsClient: '/booking/:id/reviews',

  docs: '/docs',
  // Admin routes
  bookings: {
    index: '/dashboard/bookings',
    index2: '/dashboard/bookings2',
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
  subscriptionPlansAdmin: {
    index: '/dashboard/subscription-plans',
    view: '/dashboard/subscription-plans/:id',
    add: '/dashboard/subscription-plans/add',
    edit: '/dashboard/subscription-plans/:id/edit',
  },
  client: {
    subscriptions: '/dashboard/my-subscriptions',
    subscriptionMembers: '/dashboard/my-subscriptions/:id/members',
  },
  healthForms: {
    index: '/dashboard/health-forms',
    view: '/dashboard/health-forms/:id',
    pending: '/dashboard/health-forms/pending',
  },
  staff: {
    index: '/dashboard/staff',
    calendar: '/dashboard/staff/calendar',
    myCalendar: '/dashboard/staff/my-calendar',
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
  communications: {
    index: '/dashboard/communications',
    view: '/dashboard/communications/:id',
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
  blockedSlots: {
    index: '/dashboard/blocked-time-slots',
    view: '/dashboard/blocked-time-slots/:id',
    add: '/dashboard/blocked-time-slots/add',
    edit: '/dashboard/blocked-time-slots/:id/edit',
  },
};

