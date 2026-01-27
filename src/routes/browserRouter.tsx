
import { createBrowserRouter } from 'react-router-dom';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '@/components/loader/progressBar';
import ErrorPage from '@/components/errors/general-error';
import RequireAuth from './requireAuth';
import RequireRole from './requireRole';
import Layout from '@/components/layout';
import Logout from '@/pages/auth/logout';
import LandingPage from '@/pages/landing';
import { RoleEnum } from '@/interfaces/enum/RoleEnum';





const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const CancelBooking = loadable(() => import('../pages/cancelBooking'), {
  fallback: fallbackElement,
});

const Dashboard = loadable(() => import('../pages/dashboard'), {
  fallback: fallbackElement,
});

const BookingsIndex = loadable(() => import('../pages/dashboard/bookings'), {
  fallback: fallbackElement,
});

const BookingsAdd = loadable(() => import('../pages/dashboard/bookings/add'), {
  fallback: fallbackElement,
});

const BookingsView = loadable(() => import('../pages/dashboard/bookings/view'), {
  fallback: fallbackElement,
});

const ClientsIndex = loadable(() => import('../pages/dashboard/clients'), {
  fallback: fallbackElement,
});

const ClientsAdd = loadable(() => import('../pages/dashboard/clients/add'), {
  fallback: fallbackElement,
});

const ClientsEdit = loadable(() => import('../pages/dashboard/clients/edit'), {
  fallback: fallbackElement,
});

const ClientsView = loadable(() => import('../pages/dashboard/clients/view'), {
  fallback: fallbackElement,
});

const StaffIndex = loadable(() => import('../pages/dashboard/staff'), {
  fallback: fallbackElement,
});

const SubscriptionsIndex = loadable(() => import('../pages/dashboard/subscriptions'), {
  fallback: fallbackElement,
});

const SubscriptionsAdd = loadable(() => import('../pages/dashboard/subscriptions/add'), {
  fallback: fallbackElement,
});

const SubscriptionsEdit = loadable(() => import('../pages/dashboard/subscriptions/edit'), {
  fallback: fallbackElement,
});

const SubscriptionsView = loadable(() => import('../pages/dashboard/subscriptions/view'), {
  fallback: fallbackElement,
});



const ServicesIndex = loadable(() => import('../pages/dashboard/services'), {
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

const TypeServices = loadable(() => import('../pages/dashboard/type_services'), {
  fallback: fallbackElement,
});

const TypeServicesAdd = loadable(() => import('../pages/dashboard/type_services/add'), {
  fallback: fallbackElement,
});

const TypeServicesEdit = loadable(() => import('../pages/dashboard/type_services/edit'), {
  fallback: fallbackElement,
});

const TypeServicesView = loadable(() => import('../pages/dashboard/type_services/view'), {
  fallback: fallbackElement,
});

const TypeResources = loadable(() => import('../pages/dashboard/type_resource'), {
  fallback: fallbackElement,
});

const TypeResourcesAdd = loadable(() => import('../pages/dashboard/type_resource/add'), {
  fallback: fallbackElement,
});

const TypeResourcesEdit = loadable(() => import('../pages/dashboard/type_resource/edit'), {
  fallback: fallbackElement,
});

const TypeResourcesView = loadable(() => import('../pages/dashboard/type_resource/view'), {
  fallback: fallbackElement,
});



const ResourcesIndex = loadable(() => import('../pages/dashboard/resources'), {
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



const StaffAdd = loadable(() => import('../pages/dashboard/staff/add'), {
  fallback: fallbackElement,
});

const StaffEdit = loadable(() => import('../pages/dashboard/staff/edit'), {
  fallback: fallbackElement,
});

const StaffView = loadable(() => import('../pages/dashboard/staff/view'), {
  fallback: fallbackElement,
});

const StaffCalendar = loadable(() => import('../pages/dashboard/staff/calendar'), {
  fallback: fallbackElement,
});

const MyStaffCalendar = loadable(() => import('../pages/dashboard/staff/my-calendar'), {
  fallback: fallbackElement,
});

const PaymentsIndex = loadable(() => import('../pages/dashboard/payments'), {
  fallback: fallbackElement,
});

const PaymentsAdd = loadable(() => import('../pages/dashboard/payments/add'), {
  fallback: fallbackElement,
});

const PaymentsView = loadable(() => import('../pages/dashboard/payments/view'), {
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




const HealthFormClient = loadable(() => import('../pages/healthFormClient'), {
  fallback: fallbackElement,
});

const ReviewsClient = loadable(() => import('../pages/reviewsClient'), {
  fallback: fallbackElement,
});


export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <LandingPage />,
    errorElement: errorElement,
  },
  {
    path: webRoutes.cancelBooking,
    element: <CancelBooking />,
    errorElement: errorElement,
  },
  {
    path: webRoutes.healthFormClient,
    element: <HealthFormClient />,
    errorElement: errorElement,
  },
  {
    path: webRoutes.reviewsClient,
    element: <ReviewsClient />,
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
      // Admin and Reception routes
      {
        path: webRoutes.Dashboard,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <Dashboard />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.bookings.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <BookingsIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.bookings.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <BookingsAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.bookings.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <BookingsView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.clients.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <ClientsIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.clients.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <ClientsAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.clients.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <ClientsEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.clients.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <ClientsView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.payments.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <PaymentsIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.payments.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <PaymentsAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.payments.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Reception]}>
            <PaymentsView />
          </RequireRole>
        ),
      },
      // Admin only routes
      {
        path: webRoutes.staff.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <StaffIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.staff.calendar,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <StaffCalendar />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.staff.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <StaffAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.staff.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin,RoleEnum.Staff]}>
            <StaffEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.staff.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin, RoleEnum.Staff]}>
            <StaffView />
          </RequireRole>
        ),
      },
      {
        path:webRoutes.staff.myCalendar,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Staff]}>
            <MyStaffCalendar />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.subscriptions.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <SubscriptionsIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.subscriptions.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <SubscriptionsAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.subscriptions.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <SubscriptionsEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.subscriptions.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <SubscriptionsView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.services.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ServicesIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.services.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ServicesAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.services.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ServicesEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.services.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ServicesView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeServices.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeServices />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeServices.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeServicesAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeServices.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeServicesEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeServices.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeServicesView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeResources.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeResources />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeResources.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeResourcesAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeResources.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeResourcesEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.typeResources.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <TypeResourcesView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.resources.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ResourcesIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.resources.add,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ResourcesAdd />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.resources.edit,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ResourcesEdit />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.resources.view,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ResourcesView />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.reports.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <ReportsIndex />
          </RequireRole>
        ),
      },
      {
        path: webRoutes.settings.index,
        element: (
          <RequireRole allowedRoles={[RoleEnum.Admin]}>
            <SettingsIndex />
          </RequireRole>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: errorElement,
  },
]);
