'use client'

import { resetPassword } from "@/actions/auth-actions"
import useAuthStore from "@/stores/authStore"
import { addToast, Button, Card, CardBody, CardHeader, Form, Input, Spinner } from "@heroui/react"
import { redirect } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"

const ResetPasswordForm: React.FC = () => {

    const {isLoading: isLoadingUser, user, getUser} = useAuthStore()

    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [passwordErrors, setPasswordErrors] = useState<Array<string>>([])

    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUser()
    })

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

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const {password} = Object.fromEntries(new FormData(e.currentTarget))

        if (typeof password == "string") {
            setIsLoading(true)
            const res = await resetPassword({newPassword: password})
            switch(res.message) {
                case "success": {
                    return redirect('/')
                }
                case "same_password": {
                    addToast({
                        color: "danger",
                        title: "Password reset error",
                        description: "You cannot use the same password."
                    })
                    break;
                }
                default: {
                    addToast({
                        color: "danger",
                        title: "Password reset error",
                        description: "An uknown error has occured."
                    })
                    break;
                }
            }
            setIsLoading(false)
        }
            
    }

    if(isLoadingUser) return null
    
    if (!isLoadingUser && !user) return redirect('/auth/sign-in')
    
    return (
        <Card className="w-full md:w-md p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center">
                    <header className="font-bold text-2xl text-foreground">Reset your password</header>
                    <span className="text-foreground/50">Enter a new password</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleFormSubmit}>
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
                    label="New password"/>

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
                </Form>
            </CardBody>
        </Card>
    )
}

export default ResetPasswordForm