'use server'

import { DetailedEvent } from "@/stores/eventStore"
import { createClient } from "@/utils/supabase/server"

export const addEvent = async ({
    title,
    coordinates,
    fullAddress,
    address,
    postalCode,
    country,
    place,
    region,
    startDate,
    endDate,
    maximumPlayers,
    description,
    game,
    format
}: {
    title: string,
    coordinates: {latitude: number, longitude: number},
    fullAddress: string,
    address: string,
    postalCode: string,
    country: string,
    place: string,
    region: string,
    startDate: Date,
    endDate: Date,
    maximumPlayers: number,
    description: string | null,
    game: "mtg",
    format: {
        key: string,
        label: string
    },
}) => {

    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()

        // Return if the user is not authenticated
        if(!user) {
            return {
                message: "Unauthorized",
                status: 401
            }
        }

        //Check date validity
        if(endDate.getTime() < (startDate.getTime() + 60 * 60 * 1000)) {
            return {
                message: "Event must last at least an hour",
                status: 400
            }
        }

        const { error } = await supabase.from('events').insert({
            host_id: user.id,
            title: title,
            description: description,
            start_date: startDate,
            end_date: endDate,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            game: game,
            format: format,
            maximum_players: maximumPlayers,
            place: place,
            region: region,
            country: country,
            postal_code: postalCode,
            address: address,
            full_address: fullAddress,
        }).select()

        if(error) {
            console.log(error)
            return {
                message: "An unknown error occured.",
                status: 400
            }
        }

        return {
            message: "Event added succesfully!",
            status: 200
        }
    } catch (e) {
        console.log(e)
        return {
            message: "An unknown error occured.",
            status: 500
        }
    }
}

export const getEvent = async ({id}: {id: string}) => {
    try {

        const supabase = await createClient()

        const {data: {user}} = await supabase.auth.getUser()

        const {data: event, error: eventError} =  await supabase.from("events").select(`
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
                host:profiles (user_id, avatar_url, username, bio)
            `).eq('id', id).single()
        if(event) {
            const res: DetailedEvent = {
                event: event,
                joined: false,
                users: [],
                room_id: null
            }
            const {data: eventUsers, error: usersError} = await supabase.from('events_players').select('user:profiles (user_id, avatar_url, username, bio)').eq('event_id', event.id)
            //const {data: room, error: roomError} = await supabase.from('events_rooms').select('id').eq('event_id', event.id).single()
            if(eventUsers) {
                res.users = eventUsers.map((eventUser) => eventUser.user)
                if(user) {
                    const userJoined = res.users.findIndex((eventUser) => eventUser.user_id === user.id)
                    if(userJoined !== -1) res.joined = true
                }
                for(let i = 0; i < res.event.maximum_players - res.users.length + i; i++) {
                    res.users.push(null)
                }
                return {
                    event: res,
                    status: 200,
                }
            } else {
                console.log(usersError)
                return {
                    message: "Error while fetching event data.",
                    status: 404
                }
            }
        } else {
            console.log(eventError)
            return {
                message: "The event was not found.",
                status: 404
            }
        }
    } catch (e) {
        console.log(e)
        return {
            message: "An unknown error has occured.",
            status: 500
        }
    }
}

export const joinEvent = async ({event_id}: {event_id: string}) => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {
                message: "Unauthorized",
                status: 401
            }
        }
        const {data: event} = await supabase.from('events').select('maximum_players').eq('event_id', event_id).single()
        const {data: eventUsers} = await supabase.from("events_players").select().eq('event_id', event_id)
        if(event && eventUsers && eventUsers.length < event.maximum_players) {
            const {error} = await supabase.from("events_players").insert({
                event_id: event_id,
                user_id: user.id
            })
            
            if(error) {
                console.log(error)
                return {
                    message: "Error while joining event",
                    status: 400
                }
            }
            return {
                message: "Event joined successfully!",
                status: 200
            }
        } else {
            return {
                message: "The maximum number of players for this event has been reached.",
                status: 400
            }
        }
    } catch (e) {
        console.log(e)
        return {
            message: "An unknown error has occured",
            status: 500
        }
    }
}

export const leaveEvent = async ({event_id}: {event_id: string}) => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {
                message: "Unauthorized",
                status: 401
            }
        }
        const {error} = await supabase.from("events_players").delete().eq('user_id', user.id).eq('event_id', event_id)
        if(error) {
            console.log(error)
            return {
                message: "Error while leaving event",
                status: 400
            }
        }
        return {
                message: "We're sad to see you leave :(",
                status: 200
            }
    } catch (e) {
        console.log(e)
        return {
            message: "An unknown error has occured",
            status: 500
        }
    }
}