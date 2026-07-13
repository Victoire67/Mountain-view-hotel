import { motion } from 'framer-motion'

export default function Menu(){
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold">Our Menus</h1>
        <p className="mt-2 text-neutral-400">Explore our kitchen — from light starters to hearty mains.</p>

        <div className="mt-6 grid gap-4">
          <section className="bg-neutral-900 p-4 rounded">
            <h3 className="font-semibold">Starters</h3>
            <ul className="mt-2 text-sm text-neutral-300 space-y-2">
              <li className="flex justify-between"><span>Cold starter — mixed greens</span><span>6€</span></li>
              <li className="flex justify-between"><span>Soup of the day</span><span>5€</span></li>
              <li className="flex justify-between"><span>Bruschetta</span><span>7€</span></li>
            </ul>
          </section>

          <section className="bg-neutral-900 p-4 rounded">
            <h3 className="font-semibold">Mains</h3>
            <ul className="mt-2 text-sm text-neutral-300 space-y-2">
              <li className="flex justify-between"><span>Steak with sides</span><span>24€</span></li>
              <li className="flex justify-between"><span>Grilled salmon</span><span>20€</span></li>
              <li className="flex justify-between"><span>Vegetarian risotto</span><span>16€</span></li>
            </ul>
          </section>

          <section className="bg-neutral-900 p-4 rounded">
            <h3 className="font-semibold">Desserts</h3>
            <ul className="mt-2 text-sm text-neutral-300 space-y-2">
              <li className="flex justify-between"><span>Chocolate fondant</span><span>8€</span></li>
              <li className="flex justify-between"><span>Cheese board</span><span>10€</span></li>
            </ul>
          </section>
        </div>

      </div>
    </motion.div>
  )
}
