import MenuExplorerCard from "../components/MenuExploreCard"
import swimmingPool from "../assets/swimmingPool.jpeg"
import apartment from "../assets/apartment.jpeg"
import gym from "../assets/guest-services/gym.jpg"
import {Link} from "react-router-dom"
export default function GuestServices() {
    return <div className="sm:grid sm:grid-cols-2 mt-16 sm:mt-24 sm:place-content-center gap-8 sm:gap-2 sm:mb-4 sm:w-fit mx-auto">
        <Link to = "/contact">        <MenuExplorerCard img={swimmingPool} type="Swimming pool" description="Enjoy a swimming pool" /></Link>
        <Link to="/contact"><MenuExplorerCard img={apartment} type="Apartment / hotel" description="Affortable appartment for rent" /></Link>
        <Link to="/contact">    <MenuExplorerCard img={gym} type="Gym" description="High level sport experience" /></Link>
    </div>
}