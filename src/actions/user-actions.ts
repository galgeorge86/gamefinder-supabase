'use server'

import { playStyleData } from "@/data/constants"
import { createClient } from "@/utils/supabase/server"

export const submitOnboarding = async ({
    username,
    bio,
    image,
    location,
    play_location,
    mtg_formats,
    pokemon_formats,
    yugioh_formats,
    other_formats
}: {
    username: string,
    bio: string,
    image: File | undefined,
    location: string,
    play_location: string,
    mtg_formats: string[],
    pokemon_formats: string[],
    yugioh_formats: string[],
    other_formats: string[],
}) => {
    try {
        const supabase = await createClient()
        const {data : {user}} = await supabase.auth.getUser()
        
        // Authorize user
        if(!user)
            return {message: "Unauthorized.", status: 401}

        // Validate username
        if(username.length < 3 || username.length > 16 || !username.match(/^[a-zA-Z0-9_-]+$/))
            return {message: "The username is invalid.", status: 400}
        
        const {data: userExists} = await supabase.from("profiles").select('username').eq('username', username).single()
        
        if(userExists)
            return {message: "Username is already taken.", status: 400}

        //Format play styles
        const play_styles: {
            mtg: Array<{key: string, label: string}>
            pokemon: Array<{key: string, label: string}>
            yugioh: Array<{key: string, label: string}>
            other: Array<{key: string, label: string}>
        } = {
            mtg: [],
            pokemon: [],
            yugioh: [],
            other: []
        }

        play_styles.mtg = mtg_formats.map(key => playStyleData.mtg.filter(format => format.key === key)[0])
        play_styles.pokemon = pokemon_formats.map(key => playStyleData.pokemon.filter(format => format.key === key)[0])
        play_styles.yugioh = yugioh_formats.map(key => playStyleData.yugioh.filter(format => format.key === key)[0])
        play_styles.other = other_formats.map(key => playStyleData.other.filter(format => format.key === key)[0])

        console.log(play_styles)
                
        // Handle image upload
        let avatarUrl = ""
        if(image && image instanceof File) {
                    
            // Reject files larger than 2MB
            if(image.size >= 2 * 1024 * 1024)
                return {message: "Maximum file size is 2MB.", status: 400}
        
            // Check file extensions
            if(image.type === "image/jpg" || image.type === "image/jpeg" || image.type === "image/png") {
                const imagePath = `public/${username}.${image.type.split('/')[1]}`
        
                // Upload image to supabase avatar bucket
                const {data: imageData, error: imageError} = await supabase.storage.from("avatars").upload(imagePath, image, {cacheControl: '3600', upsert: true})
                if(imageError) {
                    console.log(imageError)
                    return {message: "Error uploading image.", status: 400}
                } else {
                    avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${imageData?.fullPath}` || ""
                }
            } else {
                return {message: "Supported file types are .jpg, .jpeg, .png", status: 400}
            }
        }
        
        // Update users table with provided information
        const {error: updateError} = await supabase.from('profiles').update({
            'username': username,
            'avatar_url': avatarUrl || null,
            'bio': bio,
            'location': location,
            'play_styles': play_styles,
            'play_location': play_location,
            'onboarded': true,
            'updated_at': new Date().toLocaleString()
        }).eq('user_id', user.id)
        
        if(updateError) {
            console.log(updateError)
            return {message: "Error while updating user information.", status: 400}
        } else {
            return {message: "Success.", status: 200}
        }
    } catch (e) {
        console.log(e)
        return {
            message: "An uknown error has occured",
            status: 500
        }
    }
}