import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Homepage from '../components/Homepage/Homepage';
import AllRoutes from '../components/AllRoutes';
import RouteDetails from '../components/RouteDetails';
import CreateRoute from '../components/CreateRoute';
import CreateAscent from '../components/CreateAscent';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "routes",
        element: <AllRoutes />,
      },
      {
        path: "routes/:routeId",
        element: <RouteDetails />,
      },
      {
        path: "routes/new",
        element: <CreateRoute />,
      },
      {
        path: "routes/:routeId/ascents/new",
        element: <CreateAscent />,
      },
    ],
  },
]);
