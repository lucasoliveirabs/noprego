import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { SessionProvider } from './SessionContext'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage/>,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/home',
    element: <HomePage/>,
    errorElement: <div>404 Not Found</div>
  }
]);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="321113386712-3u0vo7b7faoln0jr9nfvo1hoflkef7mp.apps.googleusercontent.com">
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
