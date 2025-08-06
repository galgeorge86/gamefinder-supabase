'use client'
import { useState } from "react";
import OnboardingForm from "./onboarding-form";
import WelcomeCard from "./welcome-card";

export default function OnboardingPage () {

    const [username, setUsername] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const onSuccess = (username: string) => {
        setSubmitted(true)
        setUsername(username)
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-100 to-primary dark:to-primary">
            {!submitted && <OnboardingForm onSuccess={onSuccess}/>}
            {submitted && <WelcomeCard username={username}/>}
        </main>
    )
}