import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import hero from '../assets/bg.jpg'

export default function Home(){
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <section className="relative h-[56vw] sm:h-[40vw] md:h-[28vw] bg-black overflow-hidden">
        <img src={hero} alt="hotel" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

        <div className="relative max-w-4xl mx-auto px-6 h-full flex flex-col justify-center items-start gap-6 pt-12">
          <div className="bg-black/50 px-3 py-1 rounded text-xs text-yellow-300">Restaurant & Bar</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Mountain View</h1>
          <p className="text-neutral-300 max-w-md">Welcome to Mountain View — enjoy seasonal dishes, crafted cocktails and breathtaking views.</p>

          <div className="flex gap-3 mt-2">
            <Link to="/menu" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded font-semibold shadow">Explore Our Menus</Link>
            <a href="#book" className="inline-flex items-center gap-2 border border-neutral-700 px-4 py-2 rounded text-sm">Book a table</a>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold">Featured Dishes</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="bg-neutral-900 rounded overflow-hidden">
            <img src="/src/assets/chickenplate.jpg" alt="dish" className="w-full h-28 object-cover" />
            <div className="p-3 text-xs">Pan roasted chicken — 18€</div>
          </div>

          <div className="bg-neutral-900 rounded overflow-hidden">
            <img src="/src/assets/breakfast.jpg" alt="dish" className="w-full h-28 object-cover" />
            <div className="p-3 text-xs">Breakfast special — 9€</div>
          </div>

          <div className="hidden sm:block bg-neutral-900 rounded overflow-hidden">
            <img src="/src/assets/main dishes.jpg" alt="dish" className="w-full h-28 object-cover" />
            <div className="p-3 text-xs">Chef's main — 22€</div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold">Why visit us</h3>
          <ul className="mt-3 text-neutral-400 text-sm space-y-2">
            <li>Locally sourced ingredients</li>
            <li>Curated wine list and crafted cocktails</li>
            <li>Cozy atmosphere with panoramic views</li>
          </ul>
        </div>

      </section>

    </motion.main>
  )
}
