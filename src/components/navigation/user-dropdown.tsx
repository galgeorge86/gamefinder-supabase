import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@heroui/react"
import { TbLogout } from "react-icons/tb"
import { useRouter } from "next/navigation"
import useAuthStore from "@/stores/authStore"
import { RiCalendarFill, RiChat1Fill, RiMap2Fill, RiSettings2Fill, RiUser3Fill } from "react-icons/ri"

interface Props {
    descriptionColor?: string,
    description?: string,
    name: string,
    avatarUrl?: string,
}

const UserDropdown: React.FC<Props> = (props: Props) => {

    const router = useRouter()
    const {signOut} = useAuthStore()

    return (
    <Dropdown placement="bottom-end"
    classNames={{
        base: "before:bg-default-200",
        content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-background to-default-200 dark:from-default-50 dark:to-background"
    }}>
        <DropdownTrigger>
            <User
            as="button"
            classNames={{
                base: "flex-row-reverse",
                wrapper: "flex justify-center my-auto",
                name: "text-foreground ml-auto mr-0 text-base",
                description: `text-${props.descriptionColor || "foreground/50"} ml-auto mr-0`
            }}
            description={props.description}
            className="transition-transform"
            name={props.name.split(' ')[0]}
            avatarProps={{
            size:'md',
            src: props.avatarUrl,
            name: props.name,
            className: "bg-foreground text-background transition-transform",
            getInitials: (name) => name[0]
            }}/>
        </DropdownTrigger>
        <DropdownMenu
        className="text-foreground"
        classNames={{
            base: "p-2",
            list: "gap-2"
        }}
        variant="faded">
            <DropdownSection title="Account">
                <DropdownItem 
                onPress={() => router.push('/user/profile')}
                classNames={{base:'p-2'}} startContent={<RiUser3Fill size={20}/>} key="profile">My profile</DropdownItem>
                <DropdownItem classNames={{base:'p-2'}} startContent={<RiSettings2Fill size={20}/>} key="settings">Settings</DropdownItem>
            </DropdownSection>
            <DropdownSection title="Events">
                <DropdownItem 
                onPress={() => router.push('/user/explore')}
                classNames={{base:'p-2'}} startContent={<RiMap2Fill size={20}/>} key="explore">Explore</DropdownItem>

                <DropdownItem 
                onPress={() => router.push('/user/events')}
                classNames={{base:'p-2'}} startContent={<RiCalendarFill size={20}/>} key="events">Events</DropdownItem>

                <DropdownItem 
                onPress={() => router.push('/user/chat')}
                classNames={{base:'p-2'}} startContent={<RiChat1Fill size={20}/>} key="chat">Chat</DropdownItem>
            </DropdownSection>
            <DropdownItem classNames={{base:'p-2'}} startContent={<TbLogout size={20}/>} onPress={() => {signOut()}} key="signout" color="danger">
                Sign Out
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
    )
}

export default UserDropdown