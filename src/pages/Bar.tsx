import { motion } from 'framer-motion'
import wine from '../assets/wine.jpg'

export default function Bar(){
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold">Bar & Drinks</h1>
        <p className="mt-2 text-neutral-400">Enjoy curated wines, local beers and craft cocktails at the bar.</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-900 rounded overflow-hidden p-3 text-sm">
            <img src={wine} alt="wine" className="w-full h-32 object-cover rounded" />
            <div className="mt-2">Red wine — from 6€</div>
          </div>

          <div className="bg-neutral-900 rounded overflow-hidden p-3 text-sm">
            <img src="/src/assets/heineken.jpg" alt="beer" className="w-full h-32 object-cover rounded" />
            <div className="mt-2">Local beers</div>
          </div>

          <div className="bg-neutral-900 rounded p-3 text-sm">
            <div className="h-32 flex items-center justify-center text-neutral-400">Cocktail selection</div>
            <div className="mt-2">Classic & signature cocktails</div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
