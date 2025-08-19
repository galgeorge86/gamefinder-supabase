'use client'

import useAuthStore from "@/stores/authStore";
import Navigation from "../navigation/navigation";
import TabsNavigation from "../navigation/tabs-navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@heroui/react";

export default function GeneralLayout(
    {children}: Readonly<{children: React.ReactNode}>
) {

    const {getUser, isLoading} = useAuthStore()

    useEffect(() => {
        if(isLoading)
            getUser()
    })

    return (
        <div>
            {/* Loading splash screen */}
            <AnimatePresence>
                { isLoading &&
                <motion.div
                initial={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
                className="w-screen fixed z-20 bg-background items-center h-dvh flex">
                    <div className="flex m-auto flex-col gap-4">
                        <span className="text-2xl font-bold text-foreground">GameFinder</span>
                        <Spinner size="lg" color="primary"/>
                    </div>
                </motion.div>}
            </AnimatePresence>

            {/* Main page content */}
            <main className="min-h-dvh w-full flex flex-col bg-gradient-to-b from-0% from-content2 to-50% to-background">
                <Navigation/>
                {/* Page content */}
                <div className="mx-auto flex-1 flex flex-col p-4 max-w-[1280px] pt-[64px] pb-[128px]">
                    {children}
                </div>
                <TabsNavigation/>
            </main>

        </div>
    )
}