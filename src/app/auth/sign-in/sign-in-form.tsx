'use client'

import { addToast, Button, Card, CardBody, CardHeader, Form, Input, Spinner } from "@heroui/react"
import { FormEvent, useState } from "react"
import { FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"

import { redirect } from "next/navigation"
import { signIn } from "@/actions/auth-actions"
import Link from "next/link"

const SignInForm: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const {email, password} = Object.fromEntries(new FormData(e.currentTarget))

        if (typeof email === 'string' && typeof password === 'string') {
            setIsLoading(true)
            const res = await signIn({email: email, password: password})

            switch (res.message) {
                case "success": {
                    return redirect('/')
                }
                case "email_not_confirmed": {

                    return redirect(`/auth/verify-email?email=${email}`)
                }
                case "invalid_credentials": {
                    addToast({
                        color: 'danger',
                        title: "Sign in error",
                        description: "Invalid credentials."
                    })
                    break;
                }
                default: {
                    addToast({
                        color: 'danger',
                        title: "Sign in error",
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
                    <header className="font-bold text-2xl text-foreground">GameFinder</header>
                    <span className="text-foreground/50">Sign in to your GameFinder account!</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleFormSubmit}>
                    <Input
                    size="lg"
                    isRequired
                    name="email"
                    type="email"
                    label="Email"
                    />

                    <Input
                    size="lg"
                    isRequired
                    endContent={
                            <button 
                            type="button"
                            className="focus:outline-none"
                            onClick={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? <RiEyeFill/> : <RiEyeOffFill/>}
                            </button>
                    }
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    label="Password"/>

                    <span className="mx-auto text-center text-sm">Forgot your password? <Link href="/auth/forgot-password" className="hover:underline text-primary">Reset it.</Link></span>
                    <Button type="submit" 
                    className="w-full mt-4" 
                    variant="solid" 
                    color="primary" size="lg">
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>
                </Form>
                <div className="flex gap-2 flex-row w-full text-content-2">
                    <div className="h-[2px] my-auto bg-content2 rounded-full  w-full"/>
                    <span className="text-sm">OR</span>
                    <div className="h-[2px] my-auto bg-content2 rounded-full text-content-2 w-full"/>
                </div>

                {/*TODO: Integrate other auth providers (Google, Facebook or something else) */}
                <div className="flex flex-col gap-2">
                    <Button 
                    startContent={
                        <FcGoogle/>
                    }
                    size="lg" variant="bordered">
                        Sign in with Google
                    </Button>
                    <Button 
                    startContent={
                        <FaFacebook/>
                    }
                    size="lg" variant="bordered">
                        Sign in with Facebook
                    </Button>
                </div>
            </CardBody>
        </Card>
    )
}

export default SignInForm