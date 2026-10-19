// router.js
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout.jsx';
import { Home,About,Login,Register,ErrorPage } from '../views/indexViews';
import ProtectedHistory from './ProtectedHistory.jsx';
import { ROUTES } from './paths';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Rutas públicas
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.ABOUT, // "/about"
        element: <About />,
      },
      {
        path: ROUTES.LOGIN, // "/login"
        element: <Login />,
      },
      {
        path: ROUTES.REGISTER, // "/register"
        element: <Register />,
      },
      {
        path: ROUTES.HISTORY,
        element: <ProtectedHistory />,
      },
    ],
  },
]);