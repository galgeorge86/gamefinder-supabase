import useNotificationStore from "@/stores/notificationStore"
import { Avatar, Badge, Button, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react"
import { useEffect } from "react"
import {  RiNotification3Fill } from "react-icons/ri"


const Notifications: React.FC = () => {

    const {isLoading, notifications, getNotifications} = useNotificationStore()

    useEffect(() => {
        getNotifications()
    }, [])

    return (
    <Popover placement="bottom-end"
    classNames={{
        base: "before:bg-default-200",
        content: "p-2 border border-default-200 bg-gradient-to-br from-background to-default-200 dark:from-default-50 dark:to-background"
    }}>
        <Badge color="primary" isInvisible={isLoading} content={notifications.length.toString()}>
        <PopoverTrigger>
            
                <Button isIconOnly 
                radius="full"
                variant="bordered"
                startContent={<RiNotification3Fill/>}/>
            
        </PopoverTrigger>
        </Badge>
        <PopoverContent
        
        className="text-foreground w-[280px] p-4 gap-2">
            {isLoading && <Spinner size="sm" color="primary" className="m-auto"/>}
            {!isLoading && notifications.length === 0 &&
            <div className="flex flex-row gap-2 p-4 w-full">
                <RiNotification3Fill size={18} className="my-auto mx-0"/>
                <div className="flex flex-col mr-auto">
                    <span className="text-foreground">Notifications</span>
                    <span className="text-xs text-foreground/50">You have no notifications.</span>
                </div>
            </div>
            }
            {notifications.toReversed().map((notification) => {
                return (
                    <button key={notification.id} className="text-left hover:bg-content1 hover:ring-1 ring-content2 duration-150 rounded-lg flex flex-row gap-2 w-full p-2">
                        {notification.host && <Avatar size="md" name={notification.host.username} className="my-auto w-fit aspect-square" src={notification.host.avatar_url}/>}
                            <div className="flex flex-col w-4/5">
                                <span className="my-auto text-foreground">{notification.title}</span>
                                <span className="text-xs text-foreground/50 line-clamp-2">{notification.description}</span>
                            </div>
                    </button>
                )
            })}
        </PopoverContent>
    </Popover>
    )
}

export default Notifications

/* 


                    {index < notifications.length - 1 && <Divider/>}
                    </>

*/
