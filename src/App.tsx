import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout/Layout";
import MainContentPage from "./pages/MainContentPage";

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
      }

    ]
  }])

export default function App() {

  return <RouterProvider router={router} />

}
