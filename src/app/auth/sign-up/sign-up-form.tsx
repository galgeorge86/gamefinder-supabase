'use client'

import { addToast, Button, Card, CardBody, CardHeader, Form, Input, Spinner } from "@heroui/react"
import { FormEvent, useState } from "react"
import { FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"
import { redirect } from "next/navigation"
import { signUp } from "@/actions/auth-actions"
import Link from "next/link"

const SignUpForm: React.FC = () => {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const [passwordErrors, setPasswordErrors] = useState<Array<string>>([])

    const [isLoading, setIsLoading] = useState(false)

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const {email, password} = Object.fromEntries(new FormData(e.currentTarget))
        if (typeof email === 'string' && typeof password === 'string') {
            const res = await signUp({email: email, password: password})

            switch (res.message) {
                case "success": {
                    return redirect(`/auth/verify-email/?email=${email}`)
                }
                case "user_already_exists": {
                    addToast({
                        color: "danger",
                        title: "Sign up error",
                        description: "This email aready exists.",
                        endContent: (
                            <Link href="/auth/sign-in">
                                <Button color="danger">
                                    Sign In
                                </Button>
                            </Link>
                        )
                    })
                    break;
                }
                default: {
                    addToast({
                        color: "danger",
                        title: "Sign up error",
                        description: "An uknown error has occured."
                    })
                    break;
                }
            }
        }

        setIsLoading(false)
    }

    const validatePassword = (password: string) => {
        const aux = []
        if (password.length < 6) {
            aux.push("The password must be at least 8 characters long.");
        }
        if (!password.match(/[A-Z]/g)) {
            aux.push("The password must include an uppercase letter.");
        }
        if (!password.match(/[0-9]/g)) {
            aux.push("The password must include at least a number.");
        }
        setPassword(password)
        setPasswordErrors(aux)
    }

    return (
        <Card className="w-full md:w-md p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center">
                    <header className="font-bold text-2xl text-foreground">GameFinder</header>
                    <span className="text-foreground/50">Sign up to find TCG players in your area!</span>
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
                    onChange={(e) => validatePassword(e.target.value)}
                    isInvalid={passwordErrors.length != 0}
                    errorMessage={({validationDetails}) => {
                        if(validationDetails.valueMissing)
                            return "Please fill out this field"
                        else if (passwordErrors.length != 0) {
                            return (
                                <ul>
                                    {passwordErrors.map((error, index) => (
                                        <li key={index}>
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    }}
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    label="Password"/>

                    <Input
                    size="lg"
                    isRequired
                    endContent={
                            <button 
                            type="button"
                            className="focus:outline-none"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                                {confirmPasswordVisible ? <RiEyeFill/> : <RiEyeOffFill/>}
                            </button>
                    }
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={confirmPassword != password && confirmPassword != ""}
                    errorMessage={({validationDetails}) => {
                        if (validationDetails.valueMissing) {
                            return "Please fill out this field."
                        }
                        if (confirmPassword != password) {
                            return "Passwords do not match."
                        }
                    }}
                    name="confirm-password"
                    type={confirmPasswordVisible ? "text" : "password"}
                    label="Confirm password"/>

                    <Button type="submit" 
                    className="w-full mt-4" 
                    variant="solid" 
                    color="primary" size="lg"
                    isDisabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>

                    <span className="text-sm mx-auto">Already have an account? <Link href="/auth/sign-in" className="text-primary hover:underline">Sign In</Link></span>
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

export default SignUpForm