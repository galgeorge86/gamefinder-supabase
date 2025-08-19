'use client'
import { getEvent, joinEvent, leaveEvent } from "@/actions/event-actions"
import useAuthStore from "@/stores/authStore"
import useNotificationStore from "@/stores/notificationStore"
import { dateFormatted } from "@/utils/dateFormatting"
import { addToast, Avatar, Badge, Button, Divider, Popover, PopoverContent, PopoverTrigger, Slider, Spinner, Tab, Tabs } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { RiClipboardFill, RiMap2Fill, RiMapPin2Fill } from "react-icons/ri"

interface Props {
    id: string,
    onClose: () => void
}

const EventDetails: React.FC<Props> = (props: Props) => {

    const {user} = useAuthStore()
    const {getNotifications} = useNotificationStore()

    const {
        mutate: server_getEvent,
        data, 
        isPending,
    } = useMutation({
        mutationFn: getEvent
    })

    useEffect(() => {
        server_getEvent({id: props.id})
    }, [])

    const [joinedLoading, setJoinedLoading] = useState(false)
    const [leftLoading, setLeftLoading] = useState(false)

    const handleJoin = async () => {
        if(data && data.event) {
            setJoinedLoading(true)
            const res = await joinEvent({event_id: data.event.event.id})
            if(res.status === 200) {
                addToast({
                    color: 'success',
                    title: "Joined event",
                    description: `Successfully joined event: ${data.event.event.title}`
                })
                server_getEvent({id: props.id})
                getNotifications()
                setJoinedLoading(false)
            } else {
                addToast({
                    color: 'danger',
                    title: "Error joining event",
                    description: res.message
                })
                setJoinedLoading(false)
            }
        }
    }

    const handleLeave = async () => {
        if(data && data.event) {
            setLeftLoading(true)
            const res = await leaveEvent({event_id: data.event.event.id})
            if(res.status === 200) {
                addToast({
                    color: 'success',
                    title: "Left event",
                    description: `We're sad to see you leave :(`
                })
                server_getEvent({id: props.id})
                getNotifications()
                setLeftLoading(false)
            } else {
                addToast({
                    color: 'danger',
                    title: "Error leaving event",
                    description: res.message
                })
                setLeftLoading(false)
            }
        }
    }

    if (isPending) return <Spinner color="primary" className="m-auto"/>

    if(!isPending && !data?.event) return (
        <div className="flex flex-col gap-2 text-center m-auto">
            <span className="text-xl font-bold text-foreground">Event not found.</span>
            <span className="text-foreground/50">It is likely that this event was deleted by the host or has ended.</span>
        </div>
    )

    if(!isPending && data && data.event) {
        if (new Date(data.event.event.end_date).getTime() < Date.now()) {
            if (data.event.joined) {
                return (
                    <div className="flex flex-col w-full gap-8 m-auto">
                        <div className="flex flex-col text-center">
                            <span className="text-xl font-bold text-foreground">Review the players!</span>
                            <span className="text-foreground/50">How was playing with these people?</span>
                        </div>
                        <div className="flex flex-col gap-2">
                        <Tabs classNames={{
                            base: 'w-full',
                            tabList: 'w-full',
                            panel: 'mt-0'
                        }}>
                            {data.event.users.map((player) => {
                                if(player && user && player.user_id != user?.user_id) {
                                    return (
                                        <Tab key={player.username} title={player.username}
                                        className="flex flex-col gap-4 w-full">
                                            <div className="flex w-full gap-4">
                                                
                                                {data.event.event.host.user_id === player.user_id ?
                                                <Badge color="warning" content="Host">
                                                    <Avatar size="md" isBordered color="warning" name={player.username} className="my-auto w-fit aspect-square" src={player.avatar_url}/>
                                                </Badge>
                                                :
                                                <Avatar size="md" isBordered name={player.username} className="my-auto w-fit aspect-square" src={player.avatar_url}/>
                                                }
                                                <div className="flex flex-col w-4/5">
                                                    <span className="my-auto font-semibold text-base text-foreground">{player.username}</span>
                                                    <span className="text-sm text-foreground/50 line-clamp-1">{player.bio}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Fun"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Friendliness"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Skill"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                                </div>
                                        </Tab>
                                    )
                                }
                            })}
                        </Tabs>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <Button
                            color="primary"
                            onPress={() => props.onClose()}
                            size="lg">
                                Submit rating
                            </Button>
                            <Button
                            onPress={() => props.onClose()}
                            size="lg">
                                Close
                            </Button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="flex flex-col w-full gap-8 m-auto">
                        <div className="flex flex-col text-center">
                            <span className="text-xl font-bold text-foreground">This event has already ended :(</span>
                            <span className="text-foreground/50">Look around for upcoming events!</span>
                        </div>
                        <Button
                        onPress={() => props.onClose()}
                        size="lg">
                            Close
                        </Button>
                    </div>
                )
            }
        }
        
        return (
            <div className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-2 p-4 rounded-xl border-1 border-content2">
                    <span className="text-foreground/50">Hosted by:</span>
                    <div className="flex flex-row justify-between">
                        <div className="flex w-full gap-2">
                            <Avatar size="md" name={data.event.event.host.username} className="my-auto w-[40px] aspect-square" src={data.event.event.host.avatar_url}/>
                            <div className="flex flex-col w-4/5">
                                <span className="my-auto font-semibold text-base text-foreground">{data.event.event.host.username}</span>
                                <span className="text-sm text-foreground/50 line-clamp-2">{data.event.event.host.bio}</span>
                            </div>
                        </div>
                        <Button color="primary" className="my-auto">View profile</Button>
                    </div>
                    <span className="text-foreground/50">Event details:</span>
                    <div className="p-4 flex flex-col bg-content2 rounded-2xl">
                            <span className="whitespace-pre-line">{data.event.event.description || "The host has not provided any details."}</span>
                        </div>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-xl border-1 border-content2">
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-1 text-foreground/50">
                            <RiMapPin2Fill className="my-auto"/>
                            <span className="text-nowrap">Full address:</span>
                        </div>
                        <span className="text-foreground">{data.event.event.full_address}</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-1 text-foreground/50">
                            <RiMap2Fill className="my-auto"/>
                            <span className="text-nowrap">Place, region, country:</span>
                        </div>
                        <span className="text-foreground">{data.event.event.place || "N/a"}, {data.event.event.region || "N/a"}, {data.event.event.country || "N/a"}</span>
                    </div>
                    <Button 
                    onPress={() => {
                        navigator.clipboard.writeText(`${data.event.event.latitude}, ${data.event.event.longitude}`)
                        addToast({
                            title: "Copy to clipboard",
                            description: "Location coordinates copied to clipboard!",
                            color:'primary',
                            icon: <RiClipboardFill className="text-foreground"/>
                        })
                    }}
                    color="primary"
                    className="mt-2"
                    startContent={<RiClipboardFill/>}>
                        Copy location coordinates
                    </Button>
                </div>
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex flex-col p-4 rounded-xl border-1 border-content2 w-1/2">
                        <span className="text-nowrap text-foreground/50">Starting:</span>
                        <span className="text-foreground">{dateFormatted(data.event.event.start_date.toLocaleString())}</span>
                    </div>
                    <div className="flex flex-col p-4 rounded-xl border-1 border-content2 w-1/2">
                        <span className="text-nowrap text-foreground/50">Ending:</span>
                        <span className="text-foreground">{dateFormatted(data.event.event.end_date.toLocaleString())}</span>
                    </div>
                </div>
                <Divider/>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-row gap-4 mx-auto">
                        <span>Participating players:</span>
                        <span>{data.event.users.filter((user) => user !== null).length}/{data.event.event.maximum_players}</span>
                    </div>
                    <div className={`grid grid-cols-${data.event.event.maximum_players < 6 ? data.event.event.maximum_players : '6'} gap-4 items-center mx-auto`}>
                        {data.event.users.map((player, index) => {
                            if(player === null) {
                                return(
                                    <Popover isTriggerDisabled={data.event.joined} key={index}>
                                        <PopoverTrigger>
                                            <Avatar size="lg" name="+" isBordered className="text-xl"/>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-2">
                                            <Button 
                                            isDisabled={joinedLoading}
                                            onPress={() => handleJoin()} 
                                            color="primary">
                                                {joinedLoading ? <Spinner color="white" size="sm"/> : 'Join event!'}
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                            if(user && user.user_id === player.user_id) {
                                return (
                                <Badge key={index} content="You" className="text-xs" color="primary">
                                    <Avatar size="lg" color="primary" isBordered name={player.username} src={player.avatar_url}/>
                                </Badge>
                                )
                            }
                            if(player.user_id === data.event.event.host.user_id) {
                                return (
                                <Popover key={index} className="w-[230px]">
                                    <Badge key={index} content="Host" className="text-xs" color="warning">
                                        <PopoverTrigger>
                                            <Avatar size="lg" color="warning" isBordered name={player.username} src={player.avatar_url}/>
                                        </PopoverTrigger>
                                    </Badge>
                                        <PopoverContent className="p-4 gap-4 flex flex-col">
                                            <div className="flex w-full gap-2">
                                                <Avatar size="md" name={player.username} className="my-auto w-[40px] aspect-square" src={player.avatar_url}/>
                                                <div className="flex flex-col w-3/5">
                                                    <span className="my-auto text-sm text-foreground">{player.username}</span>
                                                    <span className="text-xs text-foreground/50 line-clamp-3">{player.bio}</span>
                                                </div>
                                            </div>
                                            <Button className="w-full" size="sm" color="primary">View profile</Button>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                            return(
                                    <Popover key={index} className="w-[230px]">
                                        <PopoverTrigger>
                                            <Avatar size="lg" src={player.avatar_url} name={player.username} isBordered className="text-xl"/>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-4 gap-4 flex flex-col">
                                            <div className="flex w-full gap-2">
                                                <Avatar size="md" name={player.username} className="my-auto w-[40px] aspect-square" src={player.avatar_url}/>
                                                <div className="flex flex-col w-3/5">
                                                    <span className="my-auto text-sm text-foreground">{player.username}</span>
                                                    <span className="text-xs text-foreground/50 line-clamp-3">{player.bio}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <Button className="w-full" size="sm" color="primary">View profile</Button>
                                                {user && user.user_id === data.event.event.host.user_id && 
                                                <Button color="danger" size="sm" className="text-white w-full">
                                                    Kick player
                                                </Button>
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                        })}
                    </div>
                </div>
                <div className="flex flex-col mb-24 mt-4 gap-4">
                    {data.event.joined && (!user || user.user_id !== data.event.event.host.user_id) &&
                    <Button 
                    size="lg"
                    isDisabled={leftLoading}
                    onPress={() => handleLeave()}
                    className="text-white"
                    color="danger">
                        {leftLoading ? <Spinner color="white" size="sm"/> : 'Leave event :('}
                    </Button>
                    }
                    {!data.event.joined && 
                    <Button 
                    size="lg"
                    isDisabled={joinedLoading}
                    onPress={() => handleJoin()} 
                    color="primary">
                        {joinedLoading ? <Spinner color="white" size="sm"/> : 'Join event!'}
                    </Button>
                    }
                    { user && user.user_id === data.event.event.host.user_id && 
                    <Button color="danger" size="lg" className="text-white">
                        Cancel event
                    </Button>
                    }
                    <Button onPress={() => props.onClose()} color="default" size="lg" className="text-white">
                        Close
                    </Button>
                </div>
            </div>
        )
    }
}

export default EventDetails

/* 

<span className="text-3xl font-bold text-foreground">{openEvent.title}</span>
                                <div className="flex flex-row gap-2">
                                    <span className={`text-${gamesData[openEvent.game].color}`}>{gamesData[openEvent.game].label}</span>
                                    <Chip color={gamesData[openEvent.game].color}>{openEvent.format.label}</Chip>
                                </div>



<div className="flex flex-col gap-8">
                            {data.event.users.map((player) => {
                                if(player && user && player.user_id != user?.user_id) {
                                    return (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-row gap-2 mr-auto">
                                                <Avatar name={player.username} src={player.avatar_url}/>
                                                <span className="text-xl font-bold text-foreground my-auto">{player.username}</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Fun"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Friendliness"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                                <Slider
                                                size="sm"
                                                showSteps
                                                showOutline
                                                defaultValue={3}
                                                label="Skill"
                                                step={0.5}
                                                minValue={1}
                                                maxValue={5}/>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>

*/