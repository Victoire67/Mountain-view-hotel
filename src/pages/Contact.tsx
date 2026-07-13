import { motion } from 'framer-motion'

export default function Contact(){
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="mt-2 text-neutral-400">Get in touch to book a table or to ask about private events.</p>

        <form className="mt-6 grid gap-3">
          <input className="p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Name" />
          <input className="p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Email" />
          <textarea className="p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Message" rows={4} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded w-full">Send message</button>
        </form>

      </div>
    </motion.div>
  )
}
