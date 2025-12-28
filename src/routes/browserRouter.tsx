import { createBrowserRouter } from 'react-router-dom';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '@/components/loader/progressBar';
import ErrorPage from '@/components/errors/general-error';
import RequireAuth from './requireAuth';
import Layout from '@/components/layout';
import Logout from '@/pages/auth/logout';
import LandingPage from '@/pages/landing';


const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const BookingWizard = loadable(() => import('../pages/landing/booking'), {
  fallback: fallbackElement,
});

const Dashboard = loadable(() => import('../pages/dashboard'), {
  fallback: fallbackElement,
});

const BookingsIndex = loadable(() => import('../pages/dashboard/bookings'), {
  fallback: fallbackElement,
});

const ClientsIndex = loadable(() => import('../pages/dashboard/clients'), {
  fallback: fallbackElement,
});

const StaffIndex = loadable(() => import('../pages/dashboard/staff'), {
  fallback: fallbackElement,
});

const SubscriptionsIndex = loadable(() => import('../pages/dashboard/subscriptions'), {
  fallback: fallbackElement,
});

const HealthFormsIndex = loadable(() => import('../pages/dashboard/health-forms'), {
  fallback: fallbackElement,
});

const ServicesIndex = loadable(() => import('../pages/dashboard/services'), {
  fallback: fallbackElement,
});

const ResourcesIndex = loadable(() => import('../pages/dashboard/resources'), {
  fallback: fallbackElement,
});

const HammamSessionsIndex = loadable(() => import('../pages/dashboard/hammam-sessions'), {
  fallback: fallbackElement,
});

const HammamSessionsAdd = loadable(() => import('../pages/dashboard/hammam-sessions/add'), {
  fallback: fallbackElement,
});

const ResourcesAdd = loadable(() => import('../pages/dashboard/resources/add'), {
  fallback: fallbackElement,
});

const ResourcesEdit = loadable(() => import('../pages/dashboard/resources/edit'), {
  fallback: fallbackElement,
});

const ResourcesView = loadable(() => import('../pages/dashboard/resources/view'), {
  fallback: fallbackElement,
});

const ServicesAdd = loadable(() => import('../pages/dashboard/services/add'), {
  fallback: fallbackElement,
});

const ServicesEdit = loadable(() => import('../pages/dashboard/services/edit'), {
  fallback: fallbackElement,
});

const ServicesView = loadable(() => import('../pages/dashboard/services/view'), {
  fallback: fallbackElement,
});

const StaffAdd = loadable(() => import('../pages/dashboard/staff/add'), {
  fallback: fallbackElement,
});

const StaffEdit = loadable(() => import('../pages/dashboard/staff/edit'), {
  fallback: fallbackElement,
});

const StaffView = loadable(() => import('../pages/dashboard/staff/view'), {
  fallback: fallbackElement,
});

const PaymentsIndex = loadable(() => import('../pages/dashboard/payments'), {
  fallback: fallbackElement,
});

const ReportsIndex = loadable(() => import('../pages/dashboard/reports'), {
  fallback: fallbackElement,
});

const SettingsIndex = loadable(() => import('../pages/dashboard/settings'), {
  fallback: fallbackElement,
});

const Register = loadable(() => import('../pages/auth/components/register'), {
  fallback: fallbackElement,
});


const Login = loadable(() => import('../pages/auth/sign-in'), {
  fallback: fallbackElement,
});







export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <LandingPage />,
    errorElement: errorElement,
  },


  {
    path: webRoutes.login,
    element: <Login />,
    errorElement: errorElement,

  }, {
    path: webRoutes.register,
    element: <Register />,
    errorElement: errorElement,

  },
  {
    path: webRoutes.logout,
    element: <Logout />,
    errorElement: errorElement,

  },
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.Dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.bookings.index,
        element: <BookingsIndex />,
      },
      {
        path: webRoutes.clients.index,
        element: <ClientsIndex />,
      },
      {
        path: webRoutes.staff.index,
        element: <StaffIndex />,
      },
      {
        path: webRoutes.subscriptions.index,
        element: <SubscriptionsIndex />,
      },
      {
        path: webRoutes.healthForms.index,
        element: <HealthFormsIndex />,
      },
      {
        path: webRoutes.services.index,
        element: <ServicesIndex />,
      },
      {
        path: webRoutes.services.add,
        element: <ServicesAdd />,
      },
      {
        path: webRoutes.services.edit,
        element: <ServicesEdit />,
      },
      {
        path: webRoutes.services.view,
        element: <ServicesView />,
      },
      {
        path: webRoutes.resources.index,
        element: <ResourcesIndex />,
      },
      {
        path: webRoutes.resources.add,
        element: <ResourcesAdd />,
      },
      {
        path: webRoutes.resources.edit,
        element: <ResourcesEdit />,
      },
      {
        path: webRoutes.resources.view,
        element: <ResourcesView />,
      },
      {
        path: webRoutes.staff.add,
        element: <StaffAdd />,
      },
      {
        path: webRoutes.staff.edit,
        element: <StaffEdit />,
      },
      {
        path: webRoutes.staff.view,
        element: <StaffView />,
      },
      {
        path: webRoutes.hammamSessions.index,
        element: <HammamSessionsIndex />,
      },
      {
        path: webRoutes.hammamSessions.add,
        element: <HammamSessionsAdd />,
      },
      {
        path: webRoutes.payments.index,
        element: <PaymentsIndex />,
      },
      {
        path: webRoutes.reports.index,
        element: <ReportsIndex />,
      },
      {
        path: webRoutes.settings.index,
        element: <SettingsIndex />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: errorElement,
  },
]);
