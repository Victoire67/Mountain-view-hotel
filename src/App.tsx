import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout/Layout";
import MainContentPage from "./pages/MainContentPage";
import GuestServices from "./pages/GuestServices"
import Contact from "./pages/Contact"
import LoginPage from "./pages/admin/Login";
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import Dashboard from "./pages/admin/Admin";
import { AuthProvider } from "./context/AuthContext";


const router = createBrowserRouter([
  {


    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },

      {
        path: "food",
        element: <MainContentPage type="food" />
      },
      {
        path: "drinks",
        element: <MainContentPage type="drinks" />
      },
      {
        path: "guest-services",
        element: <GuestServices />
      }, {
        path: "contact",
        element: <Contact />
      },
    ],

  }, { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />, // no children prop passed here — correct!
    children: [
      { path: "/dashboard", element: <Dashboard /> },
     ],
  },

])

export default function App() {

  return <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
}