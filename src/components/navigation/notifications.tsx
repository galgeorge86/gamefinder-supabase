import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/react"
import { RiNotification3Fill } from "react-icons/ri"


const Notifications: React.FC = () => {

    return (
    <Dropdown placement="bottom-end"
    classNames={{
        base: "before:bg-default-200",
        content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-background to-default-200 dark:from-default-50 dark:to-background"
    }}>
        <DropdownTrigger>
            <Button isIconOnly 
            radius="full"
            variant="bordered"
            startContent={<RiNotification3Fill/>}/>
        </DropdownTrigger>
        <DropdownMenu
        className="text-foreground"
        classNames={{
            base: "p-2",
            list: "gap-2"
        }}
        variant="faded">
            <DropdownSection title="Inbox" className="text-foreground/50">
                <DropdownItem isReadOnly
                key="none" className="text-foreground p-4"
                description={"Your inbox is currently empty"}
                classNames={{description: 'text-foreground/50'}}  
                startContent={<RiNotification3Fill size={20}/>} >
                    No notifications
                </DropdownItem>
            </DropdownSection>
        </DropdownMenu>
    </Dropdown>
    )
}

export default Notifications