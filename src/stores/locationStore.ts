import { create } from "zustand"
import { immer } from "zustand/middleware/immer"


interface ActiveUser {
    user_id: string,
    avatar_url: string | null,
    username: string,
    game: "mtg" // MTG only, for now
    looking_for: Array<"string"> // Game formats of the selected game
    location: {
        lat: number,
        long: number
    }
}

interface Party {
    users: Array<{
        user_id: string,
        avatar_url: string | null,
        username: string,
        deck: {
            name: string,
            url: string,
        } | null
    }>
    max_players: number,
    game_mode: string,
    location: {
        lat: number, 
        long: number
    },
    start_date: Date,
    end_date: Date,
}

interface State {
    activeUsers: Array<ActiveUser>
    activeParties: Array<Party>,
    isLoading: boolean,
    isActive: boolean,
    location: {
        lat: number,
        long: number
    } | null
}

const initialState: State = {
    activeParties: [],
    activeUsers: [],
    isLoading: false,
    isActive: false,
    location: null
}

interface Actions {
    getLocation: () => void,
    setActive: () => void,
    setInactive: () => void
}

const useLocationStore = create(
    immer<State & Actions>((set) => ({
        ...initialState,
        getLocation: async () => {
            if('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(({coords}) => {
                    const {latitude, longitude} = coords
                    console.log(coords)
                    set((state) => {
                        state.isLoading = false
                        state.location = {
                            lat: latitude,
                            long: longitude,
                        }
                    })
                })
            }
        },
        setActive: async () => {
            if('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(({coords}) => {
                    const {latitude, longitude} = coords
                    set((state) => {
                        state.isActive = true
                        state.isLoading = false
                        state.location = {
                            lat: latitude,
                            long: longitude,
                        }
                    })
                })
            }
        },
        setInactive: async () => {
            set((state) => {
                state.activeParties = initialState.activeParties
                state.activeUsers = initialState.activeUsers
                state.isActive = initialState.isActive
                state.location = initialState.location
                state.isLoading = initialState.isLoading
            })
        }
    }))
)

export default useLocationStore