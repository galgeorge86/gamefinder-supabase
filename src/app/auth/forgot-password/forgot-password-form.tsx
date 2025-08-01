'use client'

import { forgotPassword } from "@/actions/auth-actions"
import { addToast, Button, Card, CardBody, CardHeader, Form, Input, Spinner } from "@heroui/react"
import { FormEvent, useState } from "react"

const ForgotPasswordForm: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false)

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {email} = Object.fromEntries(new FormData(e.currentTarget))
        if(typeof email === "string") {
            setIsLoading(true)
            const res = await forgotPassword({email})
            switch (res.message) {
                case "success": {
                    addToast({
                        color: "success",
                        title: "Password Reset",
                        description: "An email has been sent to your email address."
                    })
                    break;
                }
                case "email_address_invalid": {
                    addToast({
                        color: "danger",
                        title: "Password Reset",
                        description: "The email address you provided is invalid."
                    })
                    break;
                }
                case "over_email_send_rate_limit": {
                    addToast({
                        color: "danger",
                        title: "Password Reset",
                        description: "You have already requested a password reset. Make sure to check the spam folder or try again in a few minutes."
                    })
                    break;
                }
                default: {
                    addToast({
                        color: "danger",
                        title: "Password Reset",
                        description: "An unknown error has occured."
                    })
                    break;
                }
            }
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full md:w-md p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center">
                    <header className="font-bold text-2xl text-foreground">Forgot your password?</header>
                    <span className="text-foreground/50">Enter the email address assigned to your account.</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleFormSubmit}>
                    <Input
                    size="lg"
                    isRequired
                    name="email"
                    label="Email"
                    type="email"/>

                    <Button type="submit" 
                    className="w-full mt-4" 
                    variant="solid" 
                    color="primary" size="lg"
                    isDisabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default ForgotPasswordForm