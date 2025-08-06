import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import Link from "next/link"
import {  RiMap2Fill, RiUser3Fill } from "react-icons/ri"

const WelcomeCard: React.FC<{username: string}> = ({username}: {username: string}) => {
    return (
        <Card className="w-full md:w-xl p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center text-center">
                    <header className="font-bold text-2xl text-foreground">Welcome, {username}!</header>
                    <span className="text-foreground/50">What would you like to do next?</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
                <Link href="/user/explore">
                    <Button 
                    startContent={<RiMap2Fill size={20}/>}
                    className="w-full" size="lg" color="primary">
                        Look for TCG events in your area
                    </Button>
                </Link>
                <Link href="/user/profile">
                    <Button 
                    startContent={<RiUser3Fill size={20}/>}
                    className="w-full" size="lg" variant="bordered">
                        View your profile
                    </Button>
                </Link>
            </CardBody>
        </Card>
    )
}

export default WelcomeCard