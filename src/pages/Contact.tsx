import { motion } from 'framer-motion'
import imageUrl from "../assets/apartment.jpeg"

import { useState } from "react"



export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `Message from ${formData.name || "website contact form"}`
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`

    const mailtoLink = `mailto:mountainviewapartmentsrw@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoLink
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-14 w-full bg h-screen" style={{ backgroundImage: `url(${imageUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto px-4 py-4" >
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="mt-2 text-neutral-400">Get in touch to book a table or to ask about private events.</p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
          <input name="name" className="p-3 rounded bg-neutral-900 border-none outline-none" placeholder="Name" value={formData.name}
            onChange={handleChange} />
          <input name="email" className="p-3 rounded bg-neutral-900 border-none outline-none " placeholder="Email" value={formData.email}
            onChange={handleChange} />
          <textarea name="message" className="p-3 rounded bg-neutral-900 border-none outline-none " placeholder="Message" rows={4} value={formData.message}
            onChange={handleChange} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded w-full">Send message</button>
        </form>

      </div>
    </motion.div>
  )
}