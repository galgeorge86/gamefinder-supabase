import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createClient } from "@/utils/supabase/client";


// TODO: Fix supabase returning host as array, expected to return single object
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Event = {
    id: string,
    host: any,
    title: string,
    latitude: number,
    longitude: number,
    full_address: string,
    address: string,
    postal_code: string,
    country: string,
    place: string,
    region: string,
    start_date: Date,
    end_date: Date,
    maximum_players: number,
    description: string,
    game: "mtg" | "yugioh" | "pokemon",
    format: {
        key: string,
        label: string
    },
    created_at: Date,
    updated_at: Date,
}

type State = {
    isLoading: boolean
    events: Array<Event>
}

type Actions = {
    getEvents: () => void
    clearEvents: () => void
}

const initialState: State = {
    isLoading: true,
    events: []
}

const useEventStore = create(
    immer<State & Actions>((set) => ({
        ...initialState,
        getEvents: async () => {
            set((state) => {
                state.isLoading = true
            })
            const supabase = await createClient()
            const {data: events} = await supabase.from("events").select(`
                id,
                title,
                description,
                start_date,
                end_date,
                latitude,
                longitude,
                game,
                format,
                maximum_players,
                place,
                region,
                country,
                postal_code,
                address,
                full_address,
                created_at,
                updated_at,
                host:profiles (user_id, avatar_url, username)
            `)
            if(events) {
                const formattedEvents: Array<Event> = []
                events.map((event) => {
                    formattedEvents.push({
                        ...event,
                        host: event.host
                    })
                })
                set((state) => {
                    state.events = formattedEvents
                    state.isLoading = false
                })
            }
        },
        clearEvents: () => {
            set((state) => {
                state.events = []
                state.isLoading = false
            })
        },
    }))
)

export default useEventStore