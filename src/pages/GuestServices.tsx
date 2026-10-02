import MenuExploreCard from "../components/MenuExploreCard"
import SectionTitle from "../components/SectionTitle"
import swimmingPool from "../assets/swimmingPool.jpeg"
import apartment from "../assets/apartment.jpeg"
import gym from "../assets/guest-services/gym.jpg"

const services = [
    { img: swimmingPool, type: "Swimming pool", description: "Enjoy a swimming pool" },
    { img: apartment, type: "Apartment / hotel", description: "Affordable apartments for rent" },
    { img: gym, type: "Gym", description: "High level sport experience" },
]

export default function GuestServices() {
    return <section className="mx-auto max-w-7xl px-4 pt-32 pb-24">
        <SectionTitle eyebrow="Your stay" title="Guest Services" />
        <p className="mx-auto mt-6 max-w-xl text-center text-white/65">
            Everything you need to relax, recharge and feel at home. Tap a service to get in touch.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
                <MenuExploreCard key={s.type} to="/contact" index={i} {...s} />
            ))}
        </div>
    </section>
}
