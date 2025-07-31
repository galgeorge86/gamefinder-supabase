'use client'
import SignUpForm from "./sign-up-form";
import {motion} from 'framer-motion'

export default function SignUpPage () {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}>
            <SignUpForm/>
            </motion.div>
        </main>
    )
}