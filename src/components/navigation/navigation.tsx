'use client'

import { Button } from "@heroui/react"
import Link from "next/link"
import UserDropdown from "./user-dropdown"
import { AnimatePresence } from "framer-motion"
import {motion} from 'framer-motion'
import { useEffect } from "react"
import useAuthStore from "@/stores/authStore"
import UserStatusSelect from "../custom/user-status-select"

const Navigation: React.FC = () => {

    const {isLoading, user, getUser } = useAuthStore()
    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className="sticky top-0 h-[64px] flex w-full items-center bg-background border-b-1 border-foreground/5">
            <header className="p-4 flex w-full justify-between max-w-[1280px] mx-auto">
                {/* Gamefinder Logo (To be added) */}
                <div className="flex flex-row my-auto gap-2">
                    <Link href="/"> 
                        <span className="text-2xl font-bold my-auto text-foreground">GameFinder</span>
                    </Link>
                </div>

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
                    <UserStatusSelect/>
                </motion.div>
                }

                </AnimatePresence>
                
                
                
            </header>
        </div>
    )
}

export default Navigation