import MenuExplorerCard from "../components/MenuExploreCard"
import pool from "../assets/guest-services/swimming pool.jpg"
import appartment from "../assets/guest-services/appartment.jpg"
export default function GuestServices(){
    return  <div className="sm:flex mt-16 sm:mt-24 sm:place-content-center gap-8    ">
        <MenuExplorerCard img={pool} type="Wimming pool" description="Enjoy a swimming pool"/>
        <MenuExplorerCard img={appartment} type = "Appartment" description="Affortable appartment for rent"/>
    </div>
}