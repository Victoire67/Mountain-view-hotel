import { motion } from 'framer-motion'
import plate from '../assets/chickenplate.jpg'

export default function Restaurant(){
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold">The Restaurant</h1>
        <p className="mt-2 text-neutral-400">Our restaurant serves breakfast, lunch and dinner with a seasonal menu.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-900 rounded overflow-hidden">
            <img src={plate} alt="plate" className="w-full h-44 object-cover" />
            <div className="p-4">
              <h4 className="font-semibold">Chef's Special</h4>
              <p className="text-neutral-400 text-sm mt-2">A rotating main plate inspired by local produce.</p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded p-4">
            <h4 className="font-semibold">Private dining</h4>
            <p className="text-neutral-400 text-sm mt-2">Reserve our private dining room for special occasions.</p>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
