import { createClient } from "@/utils/supabase/client"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

// TODO: Fix supabase returning host/event as array, expected to return single object
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Notification = {
    id: number,
    event: any
    host: any
    title: string,
    description: string,
    url: string,
    type: "default" | "event" | "chat" | "info",
    created_at: Date
}

const initialState: State = {
    isLoading: true,
    notifications: []
}

interface State {
    isLoading: boolean,
    notifications: Array<Notification>
}

interface Actions {
    getNotifications: () => void,
    deleteNotification: (id: number) => void,
}

const useNotificationStore = create(
    immer<State & Actions>((set) => ({
        ...initialState,
        getNotifications: async () => {
            set((state) => {
                state.isLoading = true
            })
            const supabase = createClient()
            const {data: {user}} = await supabase.auth.getUser()
            if(user) {
                const {data: notifications} = await supabase.from("notifications").select(`
                    id,
                    title,
                    description,
                    url,
                    type,
                    created_at,
                    host:profiles!notifications_host_id_fkey (user_id, username, avatar_url),
                    event:events!notifications_event_id_fkey (id, title)
                `).eq('user_id', user.id)
                set((state) => {
                    state.isLoading = false
                    state.notifications = notifications || []
                })
            } else {
                set((state) => {
                    state.isLoading = false
                    state.notifications = []
                })
            }
        },
        deleteNotification: async (id: number) => {
            const supabase = createClient()
            const {error} = await supabase.from("notifications").update({hidden: true}).eq('id', id)
            if(!error && id) {
                set((state) => {
                    const index = state.notifications.findIndex((notification) => notification.id === id)
                    if(index) {
                        state.notifications = state.notifications.splice(index, 1)
                    }
                })
            }
        }
    }))
)

export default useNotificationStore