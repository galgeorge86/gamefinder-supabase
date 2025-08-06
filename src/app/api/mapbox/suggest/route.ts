import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    try {
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        const query = req.nextUrl.searchParams.get('q')
        if(!user) {
            return NextResponse.json({message: "Unauthorized."}, {status: 401})
        } else {
            const res = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
            const suggestData = await res.json()
            return NextResponse.json(suggestData, {status: 200})
        }
    } catch(e) {
        console.log(e)
        return NextResponse.json({message: "An unknown error has occured."}, {status: 500})
    }
}