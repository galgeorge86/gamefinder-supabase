'use server'

import { createClient } from "@/utils/supabase/server"

export const submitOnboarding = async ({username, image, bio, playStyles, location, playLocation}: {
    username: string,
    image: File | undefined,
    bio: string | undefined,
    playStyles: {
        mtg: Array<{key: string, label: string}>
    },
    location: string,
    playLocation: string,
}) => {
    try {
        const supabase = await createClient()
        const {data : {user}} = await supabase.auth.getUser()

        // Authorize user and validate username

        if(!user) {
            return {
                message: "unauthorized",
                status: 401
            }
        }
        if(username.length < 3 || username.length > 16 || !username.match(/^[a-zA-Z0-9_-]+$/)) {
            return {
                message: "invalid_username",
                status: 400
            }
        }
        const {data: userExists} = await supabase.from("profiles").select('username').eq('username', username).single()
        if(userExists) {
            return {
                message: "username_already_exists",
                status: 400
            }
        }

        // Handle image upload

        let avatarUrl = ""
        if(image) {
            if(image.size >= 2 * 1024 * 1024) {
                return {
                    message: "invalid_image_size",
                    status: 400
                }
            }
            if(image.type === "image/jpg" || image.type === "image/jpeg" || image.type === "image/png") {
                const imagePath = `public/${username}.${image.type.split('/')[1]}`
                const {data: imageData, error: imageError} = await supabase.storage.from("avatars").upload(imagePath, image, {cacheControl: '3600', upsert: true})
                console.log(imageError)
                if(imageError) {
                    return {
                        message: "error_uploading_image",
                        status: 400
                    }
                } else {
                    avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${imageData?.fullPath}` || ""
                }
            } else {
                return {
                    message: "invalid_image_type",
                    status: 400
                }
            }
        }

        // Handle user onboarding

        const {error} = await supabase.from('profiles').update({
            'username': username as string,
            'avatar_url': avatarUrl,
            'bio': bio as string,
            'location': location as string,
            'play_styles': playStyles,
            'play_location': playLocation as string,
            'onboarded': true,
            'updated_at': new Date().toLocaleString()
        }).eq('user_id', user.id)

        if(error) {
            console.log(error)
            return {
                message: "error_updating_user",
                status: 400
            }
        } else {
            return {
                message: "success",
                status: 200
            }
        }
    } catch (e) {
        console.log(e)
        return {
            message: "server_error",
            status: 500
        }
    }

}