import { createBrowserRouter } from 'react-router-dom';
import Redirect from '../components/layout/Redirect';
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

 
const Dashboard = loadable(() => import('../pages/dashboard'), {
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
    path: webRoutes.Redirect,
    element: <Redirect />,
   },

  {
    path: webRoutes.login,
    element: <Login />,
    errorElement: errorElement,

  },  {
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
    
    ],
  },

  // 404
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: errorElement,
  },
]);
