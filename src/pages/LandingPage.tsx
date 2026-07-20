import MenuExploreCard from "../components/MenuExploreCard"
import food from "../assets/breakfast.jpg"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import drink from "../assets/drinks/corona.jpg"
export default function LandingPage() {
    return <div >

        <div className="w-full h-screen sm:pt-[15%] pt-[50%] bg bg-center bg-cover">

            <div className="text-center sm:w-1/2 mx-auto grid items-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-center sm:text-5xl text-4xl font-bold bg-clip-text">MOUNTAIN VIEW HOTEL</h1>
                    <h1 className="py-8">Enjoy delicious local and international cuisine, refreshing cocktails, and a
                        relaxing atmosphere at Mountain View Restaurant, Bar & Pool Bar. Whether
                        you're dining with family, meeting friends, or unwinding by the pool, we offer the
                        perfect setting for every occasion.</h1>

                </motion.div>

            </div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className=" mx-auto flex items-center place-content-center gap-8">
                    <a href="#explore"><button className="text- px-8 py-2 bg-[#FFB82B] text-black border-amber-200 border hover:text-[#FFB82B] hover:bg-transparent cursor-pointer transform transition-colors">MENU</button></a>
                    <Link to="guest-services"> <button className="text-[#FFB82B] px-8 py-2 border-amber-200 border hover:text-black hover:bg-[#FFB82B] cursor-pointer transform transition-colors">GUEST SERVICES</button>  </Link> </div>
            </motion.div>
        </div>

        <div id="explore">
            <h1 className="sm:text-[48px] text-[32px] font-bold text-center py-4" >
                Explore our Menu
            </h1>
            <div className="sm:flex items-center gap-8 place-content-center">
                <Link to="/food"> <MenuExploreCard img={food} type="Food" description="Explore the best food in Rwanda" /></Link>
                <Link to="/drinks">                <MenuExploreCard img={drink} type="Drinks" description="Explore the best drinks" /></Link>
            </div>
        </div>
    </div>

} 