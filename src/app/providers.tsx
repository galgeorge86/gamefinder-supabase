'use client'
import useAuthStore from "@/stores/authStore";
import { useLookingForStore } from "@/stores/lookingForStore";
import { createClient } from "@/utils/supabase/client";
import { HeroUIProvider,  ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";


export default function Providers (
    {children}: Readonly<{children: React.ReactNode}>
) {
    const queryClient = new QueryClient()
    const {user} = useAuthStore()
    const {getLocation, refreshLocationRealtime, getCurrent, removePlayerFromMap, addPlayerToMap, upsertPlayer, updateLocationFromPayload, getActiveUsers} = useLookingForStore()

    // Initialize Supabase client-side
    const supabase = createClient()

    //Initialize "Looking For" channel
    const lookingForChannel = supabase.channel('players-looking-for')

    useEffect(() => {
        if(user) {
            // If user is logged in, subscribe to the channel and listen to events from other players
            lookingForChannel.on(
                'broadcast',
                {event: 'update-location'},
                (payload) => {
                    //Update the location based on realtime broadcast
                    updateLocationFromPayload({
                        user_id: payload.payload.user_id,
                        latitude: payload.payload.latitude,
                        longitude: payload.payload.longitude,
                    })
                }
            ).subscribe()

            lookingForChannel.on(
                'broadcast',
                {event: 'set-active'},
                (payload) => {
                    addPlayerToMap(payload.payload.player)
                }
            ).subscribe()

            lookingForChannel.on(
                'broadcast',
                {event: 'set-inactive'},
                (payload) => {
                    removePlayerFromMap(payload.payload.user_id)
                }
            ).subscribe()

            lookingForChannel.on(
                'broadcast',
                {event: 'upsert-player'},
                (payload) => {
                    upsertPlayer(payload.payload.player)
                }
            ).subscribe()

            lookingForChannel.on(
                'broadcast',
                {event: 'delete-player'},
                (payload) => {
                    removePlayerFromMap(payload.payload.user_id)
                }
            ).subscribe()

            getLocation()
            getCurrent()
            getActiveUsers()

            const interval = setInterval(() => {
                refreshLocationRealtime()
            }, 3000)
            return () => clearInterval(interval)

        }
    }, [user])

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <ToastProvider toastProps={{
                    variant: 'flat',
                    size:'lg',
                    classNames: {
                        base: 'mt-8'
                    }
                }} placement="top-center"/>
                { children }
            </HeroUIProvider>
        </QueryClientProvider>
    )
}