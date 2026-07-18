import { motion } from "framer-motion"

type ItemProps = {
    name: string
    price: number
    frenchTr: string
    description: string
}

export default function Item({ name, price, frenchTr, description }: ItemProps) {
    return <div className="sm:w-[588px] my-4">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="flex items-center text-[#FFDCA7] place-content-between">
                <h1 className="text-xl">{name}</h1>
                <aside>{price} RWF</aside>
            </div>
            <p className="text-sm italic py-2">{frenchTr}</p>
            <p>{description}</p>
            <hr className="text-amber/80" />
        </motion.div>
    </div>
}
