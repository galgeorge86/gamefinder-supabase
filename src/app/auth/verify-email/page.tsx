'use client'

import VerifyOTPForm from "./verify-otp-form"
import {motion} from "framer-motion"
import { Suspense } from "react"

export default function VerifyEmailAddress() {

    return (  
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            <Suspense fallback={<></>}>
                <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}>
                <VerifyOTPForm/>
                </motion.div>
            </Suspense>
        </main>
    )
}