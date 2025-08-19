'use server'

import { playStyleData } from "@/data/constants"
import { createClient } from "@/utils/supabase/server"

export const getActivePlayers = async () => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const {data: activePlayers, error: activePlayersError} = await supabase.from("players_looking_for").select(`
            latitude,
            longitude,
            game,
            formats,
            title,
            description,
            tags,
            user:profiles (user_id, username, avatar_url, bio)
        `).neq('user_id', user.id)
        if(activePlayersError) {
            console.log(activePlayersError)
            return {message: "Error while getting active players.", status: 500}
        }
            return {
                activePlayers: activePlayers,
                message: "Success",
                status: 200
            }
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}

export const getCurrent = async () => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const {data: currentUser, error: currentUserError} = await supabase.from("players_looking_for").select(`
            latitude,
            longitude,
            game,
            formats,
            title,
            description,
            tags,
            active,
            user:profiles (user_id, username, avatar_url, bio)
        `).eq('user_id', user.id).single()
        if(currentUserError) {
            console.log(currentUserError)
            return {message: "Error while getting active players.", status: 400}
        }
            return {
                currentUser: currentUser,
                message: "Success",
                status: 200
            }
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}

export const updateUserLocation = async ({
    latitude,
    longitude
}: {
    latitude: number,
    longitude: number,
}) => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const {error: updateError} = await supabase.from("players_looking_for").update({
            latitude: latitude,
            longitude: longitude
        }).eq('user_id', user.id)
        if(updateError) {
            return {message: "Error updating player location.", status: 400}
        }
        return {message: "Success", status: 200}
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}

export const upsertUserLookingFor = async ({
    title,
    latitude,
    longitude,
    game,
    formats,
    description,
    tags,
}: {
    title: string,
    latitude: number,
    longitude: number,
    game: "mtg" | "pokemon" | "yugioh" | "other"
    formats: string[],
    description: string,
    tags: string[],
}) => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const formatsJson = formats.map(key => playStyleData[game].filter(format => format.key === key)[0])
        const {data: newPlayer, error: insertError} = await supabase.from("players_looking_for").upsert({
            user_id: user.id,
            title: title,
            latitude: latitude,
            longitude: longitude,
            game: game,
            formats: formatsJson,
            description: description,
            tags: tags
        }).eq('user_id', user.id).select(`
            latitude,
            longitude,
            game,
            formats,
            title,
            description,
            tags,
            active,
            user:profiles (user_id, username, avatar_url, bio)
        `).single()
        if(insertError) {
            console.log(insertError)
            return {message: "Error upserting looking for status", status: 400}
        }
        return {player: newPlayer, message: "Success", status: 200}
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}

export const deleteUserLookingFor = async () => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const { error: deleteError} = await supabase.from("players_looking_for").delete().eq('user_id', user.id)
        if(deleteError) {
            console.log(deleteError)
            return {message: "Error deleting status", status: 400}
        }
        return {user_id: user.id, message: "Success", status: 200}
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}

export const toggleActiveStatus = async ({
    status
}: {
    status: boolean
}) => {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) {
            return {message: "Unauthorized", status: 401}
        }
        const {error: updateError} = await supabase.from("players_looking_for").update({
            active: status
        }).eq('user_id', user.id)
        if(updateError) {
            return {message: "Error updating active status.", status: 400}
        }
        return {message: "Success", status: 200}
    } catch(e) {
        console.log(e)
        return {message: "An unknown error has occured.", status: 500}
    }
}