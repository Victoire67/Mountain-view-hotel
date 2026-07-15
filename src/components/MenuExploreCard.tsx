import {motion} from "framer-motion"
type MenuExplorerCardTp = {
    img: string,
    type: string,
    description: string
}
export default function MenuExploreCard({ img, type, description }: MenuExplorerCardTp) {
    return <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <div className="sm:w-120 w-full  relative h-80 rounded-sm overflow-hidden bg-linear-to-t from-black to-transparent  shadow-lg cursor-pointer group">
            <img src={img} alt="food" className=" absolute -z-1 group-hover:scale-120 transform transition-all durantion-500" />
            <div className="h-full flex items-end p-8 text-[32px]">
                <div className="flex items-end place-content-between  w-full">
                    <section>
                        <h1>{type}</h1>
                        <p className="text-primary text-[16px]">{description}</p>
                    </section>
                    <p className="text-primary text-[32px]">&rarr;</p>
                </div>
            </div>
        </div>
    </motion.div>

}