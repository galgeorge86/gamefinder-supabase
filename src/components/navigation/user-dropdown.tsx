import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User } from "@heroui/react"
import { TbCalendar, TbLogout, TbSettingsFilled, TbUserFilled } from "react-icons/tb"
import { useRouter } from "next/navigation"
import useAuthStore from "@/stores/authStore"

interface Props {
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
                name: "text-foreground text-lg",
                description: "text-foreground/50"
            }}
            className="transition-transform"
            name={props.name.split(' ')[0]}
            avatarProps={{
            size:'md',
            src: props.avatarUrl,
            name: props.name,
            className: "bg-foreground text-background transition-transform",
            getInitials: (name) => props.name.split(' ')[0][0] + name.split(' ')[1][0]
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
                onPress={() => router.push('/account')}
                classNames={{base:'p-2'}} startContent={<TbUserFilled size={20}/>} key="profil">My profile</DropdownItem>
                <DropdownItem classNames={{base:'p-2'}} startContent={<TbSettingsFilled size={20}/>} key="setari">Settings</DropdownItem>
            </DropdownSection>
            <DropdownSection title="Events">
                <DropdownItem classNames={{base:'p-2'}} startContent={<TbCalendar size={20}/>} key="mesaje">Events</DropdownItem>
            </DropdownSection>
            <DropdownItem classNames={{base:'p-2'}} startContent={<TbLogout size={20}/>} onPress={() => {signOut()}} key="signout" color="danger">
                Sign Out
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
    )
}

export default UserDropdown