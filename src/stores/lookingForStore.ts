import { getActivePlayers, getCurrent, toggleActiveStatus } from "@/actions/looking-for-actions"
import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"


// TODO: Fix supabase returning host as array, expected to return single object
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface ActiveUser {
    title: string,
    user: any
    description: string
    game: "mtg" | "pokemon" | "yugioh" | "other"
    formats: Array<{key: string, label:string}>
    latitude: number,
    longitude: number
    tags: string[]
}

interface State {
    current: ActiveUser & {active: boolean} | null,
    activeUsers: Array<ActiveUser>,
    location: {
        longitude: number,
        latitude: number,
    } | null,
    isLoading: boolean,
}

interface Actions {
    setCurrent: (player: ActiveUser & {active: boolean} | null) => void,
    getCurrent: () => void,
    getActiveUsers: () => void,
    toggleActive: (status: boolean) => void,
    getLocation: () => void,
    refreshLocationRealtime: () => void,
    updateLocationFromPayload: ({user_id, latitude, longitude}: {
        user_id: string,
        latitude: number,
        longitude: number,
    }) => void,
    removePlayerFromMap: (user_id: string) => void,
    addPlayerToMap: (player: ActiveUser) => void,
    upsertPlayer: (player: ActiveUser) => void,
}

const initialState: State = {
    current: null,
    activeUsers: [],
    location: null,
    isLoading: true,
}

// Initialize Supabase client-side
const supabase = createClient()

//Initialize "Looking For" channel
const lookingForChannel = supabase.channel('players-looking-for')

export const useLookingForStore = create(
    immer<State & Actions>((set) => ({
        ...initialState,
        setCurrent: (player: ActiveUser & {active: boolean} | null) => {
            set((state) => {
                state.current = player
            })
        },
        getCurrent: async () => {
            const res = await getCurrent()
            if(res.currentUser) {
                set((state) => {
                    state.current = res.currentUser
                    state.isLoading = false
                })
            }
        },
        getActiveUsers: async () => {
            const res = await getActivePlayers()
            if(res.activePlayers) {
                set((state) => {
                    state.activeUsers = res.activePlayers
                })
            }
        },
        getLocation: () => {
            if('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(async ({coords}) => {
                    const {latitude, longitude} = coords
                    //console.log(coords)
                    set((state) => {
                        state.location = {
                            latitude: latitude,
                            longitude: longitude,
                        }
                    })
                })
            }
        },
        toggleActive: async (status: boolean) => {
                set((state) => {
                    if(state.current) {
                        if(status === false) {
                            lookingForChannel.send({
                                event: 'set-inactive',
                                type: 'broadcast',
                                payload: {
                                    user_id: state.current.user.user_id,
                                }
                            })
                        } else {
                            lookingForChannel.send({
                                event: 'set-active',
                                type: 'broadcast',
                                payload: {
                                    player: state.current as ActiveUser,
                                }
                            })
                        }
                        state.current.active = status
                    }
                })

            await toggleActiveStatus({status: status})
        },
        refreshLocationRealtime: () => {
            if('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(async ({coords}) => {
                    const {latitude, longitude} = coords
                    set((state) => {
                        if(state.current && state.current.active && state.location?.latitude != latitude && state.location?.longitude != longitude) {
                            lookingForChannel.send({
                                type: 'broadcast',
                                event: 'update-location',
                                payload: {
                                    user_id: state.current.user.user_id,
                                    latitude: latitude,
                                    longitude: longitude
                                }
                            })
                        }
                        state.location = {
                            latitude: latitude,
                            longitude: longitude,
                        }
                    })
                    /*await updateUserLocation({
                        latitude: latitude,
                        longitude: longitude
                    })*/
                })
            }
        },
        removePlayerFromMap: (user_id: string) => {
            set((state) => {
                const aux = state.activeUsers
                const index = aux.findIndex((player) => player.user.user_id === user_id)
                aux.splice(index, 1)
                state.activeUsers = aux
            })
        },
        addPlayerToMap: (player: ActiveUser) => {
            set((state) => {
                const aux = state.activeUsers
                aux.push(player)
                state.activeUsers = aux
            })
        },
        upsertPlayer: (player: ActiveUser) => {
            set((state) => {
                const aux = state.activeUsers
                const index = aux.findIndex((auxPlayer) => auxPlayer.user.user_id === player.user.user_id)
                if(index !== -1) {
                    aux[index] = player
                } else {
                    aux.push(player)
                }
                state.activeUsers = aux
            })
        },
        updateLocationFromPayload: ({user_id, latitude, longitude}: {user_id: string, latitude: number, longitude: number}) => {
            set((state) => {
                const aux = state.activeUsers
                const index = aux.findIndex((player) => player.user.user_id === user_id)
                if(index != -1) {
                    aux[index].latitude = latitude
                    aux[index].longitude = longitude

                    state.activeUsers = aux
                }
            })
        }
    }))
)