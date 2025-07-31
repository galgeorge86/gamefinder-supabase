'use client'

import { Button, Card, CardBody, CardHeader, Form, Input, Select, SelectItem, Spinner, Textarea } from "@heroui/react"
import { FormEvent, useState } from "react"

import { redirect } from "next/navigation"
import { signIn } from "@/actions/auth-actions"

const OnboardingForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const {email, password} = Object.fromEntries(new FormData(e.currentTarget))
        if (typeof email === 'string' && typeof password === 'string') {
            const res = await signIn({email: email, password: password})
            if(res.status === 200) {
                return redirect(`/`)
            }
        }
    }

    return (
        <Card className="w-md p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center">
                    <header className="font-bold text-2xl text-foreground">Welcome</header>
                    <span className="text-foreground/50">Complete your profile information</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleFormSubmit}>
                    <Input
                    isRequired
                    name="username"
                    type="username"
                    label="Username"
                    />
                    <Textarea
                    placeholder="Write something about yourself"
                    label="Bio"
                    name="bio"
                    minRows={3}
                    maxRows={3}
                    />
                    <Input
                    label="Play style"
                    placeholder="e.g. Casual, Competitive, Commander"
                    />
                    <Input
                    label="Location"
                    placeholder="City or region"
                    />
                    <Select label="Preferred play location">
                        <SelectItem>Local Game Store</SelectItem>
                        <SelectItem>Home</SelectItem>
                        <SelectItem>Other</SelectItem>
                    </Select>


                    <Button type="submit" 
                    className="w-full mt-4" 
                    variant="solid" 
                    color="primary" size="lg">
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default OnboardingForm