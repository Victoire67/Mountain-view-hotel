// src/components/Layout.tsx
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { m } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <m.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="min-h-screen"
      >
        <Outlet />
      </m.main>
      <Footer />
      <ScrollToTop />
      <ScrollRestoration />
    </>
  );
}
