'use client'

import { tabsArray } from "@/data/constants"
import useAuthStore from "@/stores/authStore"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { RiMap2Fill } from "react-icons/ri"

import {motion} from 'framer-motion'
import Link from "next/link"

export const TabsNavigation: React.FC = () => {

    const pathname = usePathname()
    const {user, isLoading} = useAuthStore()

    return (
        <AnimatePresence>
            {!isLoading && user &&
            <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className="lg:hidden fixed z-10 left-0 right-0 bottom-0 max-h-[128px] w-full bg-background/70 backdrop-blur-lg py-2 px-4 flex flex-row justify-between gap-4 border-t-1 border-foreground/10">
                <Link
                href="/users/explore"
                className="absolute -top-1/2 left-1/2 -translate-x-1/2 p-4 shadow-xl shadow-primary/50 rounded-full bg-primary text-white flex flex-row">
                    <RiMap2Fill size={24}/>
                </Link>
                {tabsArray.map((tab) => {
                    if(pathname === tab.path)
                        return (
                            <div
                            key={tab.label} className={`text-primary items-center p-2 w-full gap-1 rounded-xl`}>
                                <div className="flex flex-col m-auto items-center">
                                    {<tab.icon size={24}/>}
                                    <span className="text-xs">{tab.label}</span>
                                </div>
                            </div>
                        )
                    else
                        return (
                            <Link href={tab.path}
                            key={tab.label} className={`text-foreground items-center p-2 w-full gap-1 rounded-xl`}>
                                <div className="flex flex-col m-auto items-center">
                                    {<tab.icon size={24}/>}
                                    <span className="text-xs">{tab.label}</span>
                                </div>
                            </Link>
                        )
                })}
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default TabsNavigation