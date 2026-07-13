import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Restaurant from './pages/Restaurant'
import Bar from './pages/Bar'
import Contact from './pages/Contact'

function AnimatedRoutes(){
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Home /></motion.div>} />
        <Route path="/menu" element={<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Menu /></motion.div>} />
        <Route path="/restaurant" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Restaurant /></motion.div>} />
        <Route path="/bar" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Bar /></motion.div>} />
        <Route path="/contact" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Contact /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen text-white bg-[#0b0b0b]">
        <Header />
        <AnimatedRoutes />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
