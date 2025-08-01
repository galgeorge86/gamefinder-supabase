'use client'

import { Button } from "@heroui/react"
import Link from "next/link"
import UserDropdown from "./user-dropdown"
import { AnimatePresence } from "framer-motion"
import {motion} from 'framer-motion'
import { useEffect } from "react"
import useAuthStore from "@/stores/authStore"
import { tabsArray } from "@/data/constants"
import { usePathname, useRouter } from "next/navigation"
import { RiMap2Fill } from "react-icons/ri"

const Navigation: React.FC = () => {

    const pathname = usePathname()
    const router = useRouter()

    const {isLoading, user, getUser } = useAuthStore()

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className="fixed z-10 left-0 right-0 top-0 h-[64px] flex w-full items-center bg-background/70 backdrop-blur-lg border-b-1 border-foreground/5">
            <header className="p-4 flex w-full justify-between max-w-[1280px] mx-auto">
                {/* Gamefinder Logo (To be added) */}
                <div className="flex flex-row my-auto gap-2">
                    <Link href="/"> 
                        <span className="text-2xl font-bold my-auto text-foreground">GameFinder</span>
                    </Link>
                </div>

                {/* Desktop version navigation */}
                <AnimatePresence>
                {!isLoading && user && 
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}} 
                className="hidden lg:flex flex-row gap-2 absolute left-1/2 -translate-x-1/2">
                    {tabsArray.map((tab) => (
                        <Button
                        onPress={() => {
                            router.push(tab.path)
                        }}
                        variant="light"
                        startContent={<tab.icon size={20}/>}
                        disabled={pathname === tab.path}
                        key={tab.label} className={`${pathname === tab.path ? "text-primary" : "text-foreground"} p-2 px-4 rounded-full`}>
                            
                            <span className="text-sm">{tab.label}</span>
                        </Button>
                    ))}
                    <Button 
                    onPress={() => {
                        router.push('/user/explore')
                    }}
                    startContent={<RiMap2Fill size={20}/>}
                    radius="full"
                    className="p-2 px-4 bg-primary">
                        <span className="text-sm">Explore</span>
                    </Button>
                </motion.div>}
                </AnimatePresence>

                {/* Auth / User Menu */}
                <AnimatePresence>

                {!isLoading && !user && 
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}}
                className="flex flex-row gap-2">
                    <Link href={'/auth/sign-in'}>
                        <Button radius="full" variant="ghost">
                            Sign In
                        </Button>
                    </Link>
                    <Link href={'/auth/sign-up'}>
                        <Button radius="full" variant="solid" className="bg-foreground text-background">
                            Sign Up
                        </Button>
                    </Link>
                </motion.div>
                }

                {!isLoading && user &&
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}}
                className="flex flex-row gap-2 w-fit">
                    <UserDropdown name={user.username} avatarUrl={user.avatar_url}/>
                </motion.div>
                }

                </AnimatePresence>
                
                
                
            </header>
        </div>
    )
}

export default Navigation