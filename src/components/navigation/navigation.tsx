'use client'

import { Button, Switch } from "@heroui/react"
import Link from "next/link"
import UserDropdown from "./user-dropdown"
import useAuthStore from "@/stores/authStore"
import { tabsArray } from "@/data/constants"
import { usePathname } from "next/navigation"
import { RiMap2Fill, RiMapPin2Fill } from "react-icons/ri"
import { useState } from "react"
import useLocationStore from "@/stores/locationStore"

const Navigation: React.FC = () => {

    const pathname = usePathname()
    const [locationState, setLocationState] = useState(false)

    const {isLoading, user } = useAuthStore()
    const {setActive, setInactive} = useLocationStore()

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
                {!isLoading && user && 
                <div
                className="hidden lg:flex flex-row gap-2 absolute left-1/2 -translate-x-1/2">
                    {tabsArray.map((tab) => (
                        <Link key={tab.label} href={tab.path}>
                            <Button
                            variant="light"
                            startContent={<tab.icon size={20}/>}
                            disabled={pathname === tab.path}
                            key={tab.label} className={`${pathname === tab.path ? "text-primary" : "text-foreground"} p-2 px-4 rounded-full`}>
                                
                                <span className="text-sm">{tab.label}</span>
                            </Button>
                        </Link>
                    ))}
                    <Link href={'/user/explore'}>
                        <Button
                        startContent={<RiMap2Fill size={20}/>}
                        radius="full"
                        className="p-2 px-4 bg-primary">
                            <span className="text-sm">Explore</span>
                        </Button>
                    </Link>
                </div>}

                {/* Auth / User Menu */}

                {!isLoading && !user && 
                <div
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
                </div>
                }

                {!isLoading && user &&
                <div
                className="flex flex-row gap-2 w-fit">
                    <UserDropdown description={locationState ? "Active" : "Inactive"} name={user.username} avatarUrl={user.avatar_url}/>
                    <Switch size="lg"
                    isSelected={locationState} 
                    onValueChange={(e) => {
                        setLocationState(e)
                        if(e) {
                            setActive()
                        } else {
                            setInactive()
                        }
                    }} 
                    color="success"
                    thumbIcon={<RiMapPin2Fill/>}/>
                </div>
                }
                
            </header>
        </div>
    )
}

export default Navigation