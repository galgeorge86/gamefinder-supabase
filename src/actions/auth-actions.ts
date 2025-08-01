'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

const signUp = async ({email, password}: {email: string, password: string}) => {
    try {
        const supabase = await createClient()
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        {/* If no identity is created, the user already exists */}
        if(data.user && !data.user.identities?.length) {
            return{
                message: "user_already_exists",
                status: 400
            }
        }

        if(error) {
            return {
                message: error.code,
                status: 400,
            }
        }
        return {
            message: "success",
            status: 200,
        }
    } catch (e) {
        console.log(e)
        return {
            message: "server_error",
            status: 500,
        }
    }
}

const verifyOTP = async ({email, token}: {email: string, token: string}) => {
    try {
        const supabase = await createClient()

        const {error} = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'signup'
        })
        if(error) {
            return {
                message: error.code,
                status: 400
            }
        }
        return {
            message: "success",
            status: 200,
        }
    } catch (e) {
        console.log(e)
        return {
            message: "server_error",
            status: 500,
        }
    }
}

const signIn = async ({email, password}: {email: string, password: string}) => {
    try {
            const supabase = await createClient()
    
            const {error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            if (error) {
                return {
                    message: error.code,
                    status: 400,
                }
            } 
            return {
                message: "success",
                status: 200
            }
        } catch (e) {
            console.log(e)
            return {
                message: "server_error",
                status: 500,
            }
        }
}

const forgotPassword = async ({email}: {email: string}) => {
    try {
    const supabase = await createClient()

    const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: process.env.SITE_URL as string + '/auth/reset-password'})
    if(error) {
        return {
            message: error.code,
            status: 400
        }
    }
    return {
        message: "success",
        status: 200
    }

    } catch (e) {
        console.log(e)
        return {
            message: "server_error",
            status: 500
        }
    }
}

const resetPassword = async ({newPassword}: {newPassword: string}) => {
    try {
        const supabase = await createClient()
        const {error} = await supabase.auth.updateUser({password: newPassword})
        if (error) {
            return {
                message: error.code,
                status: 400,
            }
        }
        return {
            message: "success",
            status: 200,
        }
    } catch (e) {
        console.log(e)
        return {
            message: "server_error",
            status: 500
        }
    }
}

const signOut = async () => {
    const supabase = await createClient()

    await supabase.auth.signOut()
    
    revalidatePath('/')
    redirect('/', RedirectType.push)
}

export {signUp, verifyOTP, signIn, signOut, forgotPassword, resetPassword}