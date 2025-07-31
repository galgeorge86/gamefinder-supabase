'use client'

import { addToast, Button, Card, CardBody, CardHeader, Form, InputOtp, Spinner } from "@heroui/react"
import { FormEvent, useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { verifyOTP } from "@/actions/auth-actions"

const VerifyOTPForm: React.FC = () => {


    const params = useSearchParams()
    const email = params.get('email')
    
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {token} = Object.fromEntries(new FormData(e.currentTarget))
        if(typeof token === 'string' && typeof email === "string") {
            setIsLoading(true)
            const res = await verifyOTP({
                email: email,
                token: token,
            })
            switch(res.message) {
                case "success": {
                    return redirect('/')
                }
                case "otp_expired" :{
                    addToast({
                        color: "danger",
                        title: "Confirmation error",
                        description: "The code you entered is invalid."
                    })
                    break;
                }
                default: {
                    addToast({
                        color: "danger",
                        title: "Confirmation error",
                        description: "An uknown error has occured."
                    })
                    break;
                }
            }
            setIsLoading(false)
        }
    }

    if(!email) { 
        return redirect('/')
    }

    return (
        <Card className="w-full md:w-md p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center">
                    <header className="font-bold text-2xl text-foreground">Welcome!</header>
                    <span className="text-foreground/50">Enter the 6-digit code you received by email</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleSubmit}>
                    <InputOtp
                    isRequired
                    name="token"
                    length={6} size="lg"
                    className="m-auto"/>
                    <Button size="lg"  color="primary" className="w-full" type="submit">
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default VerifyOTPForm