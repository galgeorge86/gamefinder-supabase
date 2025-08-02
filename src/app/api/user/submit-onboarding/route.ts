import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    try {
        const supabase = await createClient()
        const {data : {user}} = await supabase.auth.getUser()

        // Authorize user
        if(!user)
            return NextResponse.json({message: "Unauthorized.", status: 401})


        // Initialize received form data
        const formData = await req.formData()
        const username = formData.get('username') as string
        const bio = formData.get('bio') as string
        const location = formData.get('location') as string
        const playLocation = formData.get('playLocation') as string
        const playStyles = JSON.parse(formData.get('playStyles') as string) as {mtg: Array<{key: string, label: string}>}
        const image = formData.get('image') as File
        
        
        // Validate username
        if(username.length < 3 || username.length > 16 || !username.match(/^[a-zA-Z0-9_-]+$/))
            return NextResponse.json({message: "The username is invalid.", status: 400})

        const {data: userExists} = await supabase.from("profiles").select('username').eq('username', username).single()

        if(userExists)
            return NextResponse.json({message: "Username is already taken.", status: 400})
        
        // Handle image upload
        let avatarUrl = ""
        if(image && image instanceof File) {
            
            // Reject files larger than 2MB
            if(image.size >= 2 * 1024 * 1024)
                return NextResponse.json({message: "Maximum file size is 2MB.", status: 400})

            // Check file extensions
            if(image.type === "image/jpg" || image.type === "image/jpeg" || image.type === "image/png") {
                const imagePath = `public/${username}.${image.type.split('/')[1]}`

                // Upload image to supabase avatar bucket
                const {data: imageData, error: imageError} = await supabase.storage.from("avatars").upload(imagePath, image, {cacheControl: '3600', upsert: true})
                console.log(imageError)
                if(imageError) {
                    return NextResponse.json({message: "Error uploading image.", status: 400})
                } else {
                    avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${imageData?.fullPath}` || ""
                }
            } else {
                return NextResponse.json({message: "Supported file types are .jpg, .jpeg, .png", status: 400})
            }
        }

        // Update users table with provided information
        const {error: updateError} = await supabase.from('profiles').update({
            'username': username,
            'avatar_url': avatarUrl || null,
            'bio': bio,
            'location': location,
            'play_styles': playStyles,
            'play_location': playLocation,
            'onboarded': true,
            'updated_at': new Date().toLocaleString()
        }).eq('user_id', user.id)

        if(updateError) {
            return NextResponse.json({message: "Error while updating user information.", status: 400})
        } else {
            return NextResponse.json({message: "Success.", status: 200})
        }
    } catch (e) {
        console.log(e)
        return NextResponse.json({message: "An uknown error has occured.", status: 500})
    }
        
}