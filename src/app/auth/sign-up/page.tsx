'use client'
import SignUpForm from "./sign-up-form";

export default function SignUpPage () {
    return (
        
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            <SignUpForm/>
        </main>
    )
}