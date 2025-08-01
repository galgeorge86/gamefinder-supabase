'use client'

import { tabsArray } from "@/data/constants"
import useAuthStore from "@/stores/authStore"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { RiMap2Fill } from "react-icons/ri"

import {motion} from 'framer-motion'
import { useRouter } from "next/navigation"

export const TabsNavigation: React.FC = () => {

    const pathname = usePathname()
    const router = useRouter()
    const {user, getUser, isLoading} = useAuthStore()

    useEffect(() => {
        getUser
    })

    return (
        <AnimatePresence>
            {!isLoading && user &&
            <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className="lg:hidden fixed z-10 left-0 right-0 bottom-0 max-h-[128px] w-full bg-background/70 backdrop-blur-lg py-2 px-4 flex flex-row justify-between gap-4 border-t-1 border-foreground/10">
                <button 
                onClick={(e) => {
                    e.preventDefault();
                    router.push('/user/explore')
                }}
                className="absolute -top-1/2 left-1/2 -translate-x-1/2 p-4 shadow-xl shadow-primary/50 rounded-full bg-primary text-white flex flex-row">
                    <RiMap2Fill size={24}/>
                </button>
                {tabsArray.map((tab) => (
                    <button
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(tab.path)
                    }}
                    disabled={pathname === tab.path}
                    key={tab.label} className={`${pathname === tab.path ? "text-primary" : "text-foreground"} items-center p-2 w-full gap-1 rounded-xl`}>
                        <div className="flex flex-col m-auto items-center">
                            {<tab.icon size={24}/>}
                            <span className="text-xs">{tab.label}</span>
                        </div>
                    </button>
                ))}
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default TabsNavigation