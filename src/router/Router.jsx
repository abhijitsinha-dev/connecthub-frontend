import { createBrowserRouter } from 'react-router-dom';
import LoginSignup from '../pages/login-signup/LoginSignup';
import ForgotPassword from '../pages/forgot-password/ForgotPassword';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/Home';
import Create from '../pages/create/Create';
import Messenger from '../pages/messenger/Messenger';
import Profile from '../pages/profile/Profile';
import Root from './Root';

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <LoginSignup />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        element: <Layout />, // Your authenticated layout wrapper
        children: [
          {
            path: '/home',
            element: <Home />,
          },
          {
            path: '/create',
            element: <Create />,
          },
          {
            path: '/messenger',
            element: <Messenger />,
          },
          {
            path: '/profile/:username',
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

export default router;
