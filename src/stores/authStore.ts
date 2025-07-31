import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/auth-js"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

type State = {
    isLoading: boolean
    user: User | null
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
            set((state) => {
                state.isLoading = false
                state.user = user
            })
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
