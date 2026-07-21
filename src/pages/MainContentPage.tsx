
import Item from "../components/Item";
import data from "../utils/data.json";
import drinks from "../utils/data01.json"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";

type MenuType = "food" | "drinks"

type MainContentPageProps = {
    type: MenuType
}

type MenuItem = {
    name: string
    name_fr?: string
    price: number
    description?: string
}

type MenuCategory = {
    prep_time?: string
    img: string
    description: string
    items: MenuItem[]
}

const menus: Record<MenuType, MenuCategory[]> = {
    food: data,
    drinks
}


export default function MainContentPage({ type }: MainContentPageProps) {
    const images = import.meta.glob('../assets/**/*.{jpg,jpeg,png}', {
        eager: true,
        import: 'default',
    })
    const menuData = menus[type]

    const [dataOnView, setDataOnView] = useState(0)

    function nextDataOnView() {
        setDataOnView(prev => prev + 1 >= menuData.length ? 0 : prev + 1)
    }
    function prevDataOnView() {
        setDataOnView(prev => prev === 0 ? menuData.length - 1 : prev - 1)
    }
    const currentMenu = menuData[dataOnView]
    console.log(currentMenu)
    const imageUrl = images[currentMenu.img]

    return <div >
        <div className="sm:pt-[20%] pt-[50%] animation-appear text-center h-screen bg-cover bg-center bg-blend-multiply bg-linear-to-t from-black/90 to-transparent" style={{ backgroundImage: `url(${imageUrl})` }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={dataOnView}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* <h2 className="bg-black w-fit mx-auto text-white">FINE DINING EXPERIENCE</h2> */}
                    <h1 className="text-5xl font-bold text-white">{currentMenu.description}</h1>
                    {type === "food" ? <p className="flex items-center gap-2 mx-auto place-content-center bg-black w-fit mx-auto text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M7.75833 8.575L8.575 7.75833L6.41667 5.6V2.91667H5.25V6.06667L7.75833 8.575V8.575M5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667V11.6667M5.83333 5.83333V5.83333V5.83333V5.83333V5.83333V5.83333V5.83333V5.83333V5.83333V5.83333M5.83333 10.5C7.12639 10.5 8.22743 10.0455 9.13646 9.13646C10.0455 8.22743 10.5 7.12639 10.5 5.83333C10.5 4.54028 10.0455 3.43924 9.13646 2.53021C8.22743 1.62118 7.12639 1.16667 5.83333 1.16667C4.54028 1.16667 3.43924 1.62118 2.53021 2.53021C1.62118 3.43924 1.16667 4.54028 1.16667 5.83333C1.16667 7.12639 1.62118 8.22743 2.53021 9.13646C3.43924 10.0455 4.54028 10.5 5.83333 10.5V10.5" fill="#FFB82B" />
                        </svg>
                        <span className="text-white">PREPARATION TIME : {currentMenu.prep_time ?? "Varies"}</span>
                    </p>
                        : ""}
                    <div className="mt-16 mx-auto flex items-center place-content-center gap-8 ">
                        <button className="text- px-8 py-2 bg-[#FFB82B] text-black border-amber-200 border hover:text-[#FFB82B] hover:bg-transparent cursor-pointer transform transition-colors" onClick={prevDataOnView}>PREV</button>
                        <button className="text-[#FFB82B] bg-white px-8 py-2 border-amber-200 border hover:text-black hover:bg-[#FFB82B] cursor-pointer transform transition-colors" onClick={nextDataOnView}>NEXT</button>
                    </div>
                </motion.div>
            </AnimatePresence>




        </div>
        <div className="grid sm:grid-cols-2  gap-2 bg-black px-2 w-full">
            {
                currentMenu.items.map(item => <Item key={item.name} name={item.name} price={item.price} frenchTr={item.name_fr ?? item.name} description={item.description ?? ""} />)
            }
        </div>

    </div>

}
