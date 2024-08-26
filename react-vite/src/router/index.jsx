import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import UserProfilePage from '../components/UserProfilePage/UserProfilePage';
import UserProfileForm from '../components/UserProfileForm/UserProfileForm';
import Homepage from '../components/Homepage/Homepage';
import AllRoutes from '../components/AllRoutes';
import AllAscents from '../components/AllAscents';
import RouteDetails from '../components/RouteDetails';
import ManageRoutes from '../components/ManageRoutes';
import CreateRoute from '../components/CreateRoute';
import UpdateRoute from '../components/UpdateRoute';
import CreateAscent from '../components/CreateAscent';
import UpdateAscent from '../components/UpdateAscent';
import ManageAscents from '../components/ManageAscents';
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
        path: "users/:userid",
        element: <UserProfilePage />,
      },
      {
        path: "routes",
        element: <AllRoutes />,
      },
      {
        path: "routes/manage",
        element: <ManageRoutes />,
      },
      {
        path: "routes/:routeId",
        element: <RouteDetails />,
      },
      {
        path: "routes/:routeId/update",
        element: <UpdateRoute />,
      },
      {
        path: "routes/new",
        element: <CreateRoute />,
      },
      {
        path: "ascents",
        element: <AllAscents />,
      },
      {
        path: "routes/:routeId/ascents/new",
        element: <CreateAscent />,
      },
      {
        path: "ascents/manage",
        element: <ManageAscents />,
      },
      {
        path: "ascents/:ascentId/update",
        element: <UpdateAscent />,
      },
    ],
  },
]);
