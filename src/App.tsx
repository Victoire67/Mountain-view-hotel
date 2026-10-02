import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout/Layout";
import MainContentPage from "./pages/MainContentPage";
import GuestServices from "./pages/GuestServices"
import Contact from "./pages/Contact"
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
      },
      {
        path: "contact",
        element: <Contact />
      },
    ],
  },
  // Admin pages are code-split so visitors never download them
  {
    path: "/login",
    lazy: () => import("./pages/admin/Login").then(m => ({ Component: m.default })),
  },
  {
    lazy: () => import("./pages/admin/ProtectedRoute").then(m => ({ Component: m.default })),
    children: [
      {
        path: "/dashboard",
        lazy: () => import("./pages/admin/Admin").then(m => ({ Component: m.default })),
      },
    ],
  },
])

export default function App() {
  return <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
}
