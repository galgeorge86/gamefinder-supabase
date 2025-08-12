'use server'

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

        const {data: event, error} = await supabase.from('events').insert({
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
    const supabase = await createClient()
    const event =  await supabase.from("events").select(`
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
        `).eq('id', id).single()
    if(event) {
        return({
            event: event,
            status: 200
        })
    } else {
        return {
            message: "The event was not found",
            status: 500
        }
    }
}