import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx'
import AboutUs from './aboutus/index.jsx'
import ContactPage from './contactus/index.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element:<CreateTrip/>
  },
  {
    path: '/view-trip/:tripId',
    element:<ViewTrip/>
  },
  {
    path: '/my-trips',
    element: <MyTrips/>
  },
  {
    path: '/about',
    element: <AboutUs/>
  },
  {
    path: '/contact',
    element: <ContactPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster/>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
