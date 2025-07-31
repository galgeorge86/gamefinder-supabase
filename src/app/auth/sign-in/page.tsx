'use client'
import SignInForm from "./sign-in-form";

export default function SignInPage () {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            <SignInForm/>
        </main>
    )
}