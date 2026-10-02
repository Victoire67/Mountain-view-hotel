import { m } from 'framer-motion'
import imageUrl from "../assets/apartment.jpeg"
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react"
import { useState } from "react"

const channels = [
  { icon: Phone, label: "Call us", value: "+250 788 912 646", href: "tel:+250788912646" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/250788912646" },
  { icon: Mail, label: "Email", value: "mountainviewapartmentsrw@gmail.com", href: "mailto:mountainviewapartmentsrw@gmail.com" },
  { icon: MapPin, label: "Address", value: "KG 14 792 Ave St 5, Kigali", href: "https://www.google.com/maps/search/?api=1&query=KG+14+Ave+Kigali+Rwanda" },
]

const inputCls = "peer w-full rounded-xl border border-white/10 bg-white/5 px-4 pt-6 pb-2 text-white placeholder-transparent outline-none transition-colors focus:border-gold/70 focus:bg-white/[0.07]"
const labelCls = "pointer-events-none absolute left-4 top-2 text-xs text-gold/80 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gold"

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
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <img src={imageUrl} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/90 to-ink" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <m.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Get in touch</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-semibold leading-tight">We'd love to<br />hear from you</h1>
          <p className="mt-5 max-w-md text-white/70 leading-relaxed">
            Book a table, reserve an apartment, or ask about private events. We're available 24/7.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {channels.map(({ icon: Icon, label, value, href }, i) => (
              <m.li
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              >
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-ink-2/70 p-4 backdrop-blur transition-all duration-300 hover:border-gold/40 hover:-translate-y-0.5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.2em] text-white/50">{label}</span>
                    <span className="block truncate text-sm text-white">{value}</span>
                  </span>
                </a>
              </m.li>
            ))}
          </ul>
        </m.div>

        <m.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="self-start rounded-3xl border border-white/10 bg-ink-2/80 p-6 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-4"
        >
          <h2 className="font-display text-3xl">Send a message</h2>
          <div className="relative">
            <input id="name" name="name" required className={inputCls} placeholder="Name" value={formData.name} onChange={handleChange} />
            <label htmlFor="name" className={labelCls}>Name</label>
          </div>
          <div className="relative">
            <input id="email" name="email" type="email" required className={inputCls} placeholder="Email" value={formData.email} onChange={handleChange} />
            <label htmlFor="email" className={labelCls}>Email</label>
          </div>
          <div className="relative">
            <textarea id="message" name="message" required className={`${inputCls} resize-none`} placeholder="Message" rows={5} value={formData.message} onChange={handleChange} />
            <label htmlFor="message" className={labelCls}>Message</label>
          </div>
          <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3.5 font-bold uppercase tracking-[0.2em] text-sm text-ink transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(255,184,43,0.8)] active:scale-[0.99]">
            Send message
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </button>
        </m.form>
      </div>
    </section>
  )
}
