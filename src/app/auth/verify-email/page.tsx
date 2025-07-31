'use client'

import VerifyOTPForm from "./verify-otp-form"
import { Suspense } from "react"

export default function VerifyEmailAddress() {

    return (  
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            <Suspense fallback={<></>}>
                <VerifyOTPForm/>
            </Suspense>
        </main>
    )
}