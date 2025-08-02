import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type State = {
    isLoading: boolean
    user: {
        user_id: string,
        username: string,
        bio: string,
        avatar_url: string,
        play_styles: {
            mtg: Array<{
                key: string, 
                label: string
            }> | []
        },
        decks: Array<{
            game: "mtg" | "pokemon" | "yugioh"
            name: string,
            url: string,
        }> | []
        play_location: string,
        location: string,
        onboarded: boolean,
        created_at: Date,
        updated_at: Date
    } | null
}

type Actions = {
    getUser: () => void
    signOut: () => void
}

const initialState: State = {
    isLoading: true,
    user: null
}

const useAuthStore = create(
    immer<State & Actions>((set) => ({
        ...initialState,
        getUser: async () => {
            const supabase = createClient()
            const {data: {user}} = await supabase.auth.getUser()
            if(user) {
                const {data: userProfile} = await supabase.from("profiles").select('user_id, username, avatar_url, bio, location, play_styles, play_location, decks, created_at, updated_at, onboarded').eq('user_id', user?.id).single()
                set((state) => {
                    state.isLoading = false
                    state.user = userProfile
                })
            } else {
                set((state) => {
                    state.isLoading = false
                    state.user = initialState.user
                })
            }
        },
        signOut: async () => {
            set((state) => {
                state.isLoading = true
            })
            const supabase = createClient()
            await supabase.auth.signOut()
            set((state) => {
                state.isLoading = false
                state.user = initialState.user
            })
        }
    }))
)

export default useAuthStore
