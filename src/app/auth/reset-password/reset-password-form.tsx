import { createClient } from "@/utils/supabase/client"
import { Card, CardBody, CardHeader, Form } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { FormEvent } from "react"

const getUser = async () => {
    const supabase = createClient()
    const {data: {user}} = await supabase.auth.getUser()
    return user
}

const ResetPasswordForm: React.FC = () => {

    const {isPending, data: user} = useQuery({
        queryKey: ['get-user'],
        queryFn: getUser
    })

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        //TODO: Add reset password logic
            
    }

    if(isPending) return null
    
    if (!isPending && !user) return redirect('/auth/sign-in')
    
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
                    {/* TODO: Add reset password form */}
                </Form>
            </CardBody>
        </Card>
    )
}

export default ResetPasswordForm