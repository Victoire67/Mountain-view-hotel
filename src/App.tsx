import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout/Layout";
import Header from "./components/Header";
const router = createBrowserRouter([
  {


    element: <Layout />,
    children : [
      {path : "/" , element : <LandingPage />}
    ]
  }
])

export default function App() {

  return <RouterProvider router={router} />

}