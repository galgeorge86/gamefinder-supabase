'use client'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker } from "react-map-gl/mapbox"
import { Avatar, Badge, Button, Card, CardBody, Chip, Drawer, DrawerBody, DrawerContent, DrawerHeader, Select, SelectItem, SelectSection, useDisclosure } from "@heroui/react"
import useAuthStore from "@/stores/authStore"
import { TbLocationOff } from 'react-icons/tb'
import { RiAddFill, RiEdit2Fill, RiScan2Fill } from 'react-icons/ri'
import { useEffect, useState} from 'react'
import useEventStore, { Event } from '@/stores/eventStore'
import { Outfit } from 'next/font/google'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import EventDetails from './event-details.tsx'
import { gamesData, playStyleData } from '@/data/constants.ts'
import { useLookingForStore } from '@/stores/lookingForStore.ts'

//Force client, required for the useGeocodingCore hook (otherwise it throws 'document is undefined' error)
import dynamic from 'next/dynamic';
import AddStatusForm from './add-status-form.tsx'
const AddEventForm = dynamic(() => import('./add-event-form.tsx'), { ssr: false });

TimeAgo.addLocale(en)

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"]
})

const MapSection: React.FC = () => {

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const timeAgo = new TimeAgo('en-US')

    const {location, current, isLoading: isLoadingStatus, toggleActive, activeUsers} = useLookingForStore()
    const { user } = useAuthStore()
    const {events, getEvents, isLoading} = useEventStore()
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const [openEvent, setOpenEvent] = useState<Event | null>()

    const {isOpen: isOpenEvent, onOpen: onOpenEvent, onOpenChange: onOpenChangeEvent} = useDisclosure()
    const {isOpen: isOpenFilters, onOpen: onOpenFilters, onOpenChange: onOpenChangeFilters} = useDisclosure()
    const {isOpen: isOpenStatus, onOpen: onOpenStatus, onOpenChange: onOpenChangeStatus} = useDisclosure()

    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 11.5
    });

    const [game, setGame] = useState<"all" | "mtg" | "yugioh" | "pokemon" | "other">("all")

    useEffect(() => {
        if(location && (!viewState.latitude || !viewState.longitude))
            setViewState({
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: 11.5
            })
        if(isLoading)
            getEvents()
    }, [isLoading, location])

    if(!location) {
        return (
            <div className="w-full bg-radial m-auto flex flex-col gap-8 text-foreground text-center">
                <div className="flex flex-col">
                    <TbLocationOff size={64} className='mx-auto text-content3'/>
                    <span className="font-bold text-3xl mt-8">We can&apos;t access your location</span>
                    <span className="text-foreground/50">Make sure your browser has access to your location. We use your location to identify events around you.</span>
                </div>
            </div>
        )
    }

    if(location) {
        return (
            <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={accessToken}
            mapStyle={"mapbox://styles/galgeorge86/cmdvucxci00dr01pj6uwkhrhi"}
            maxZoom={20}
            >

                {/* Current user Looking For Marker */}
                {current && 
                    <Marker key={current.user.user_id} className={`${outfit.className}`} latitude={location.latitude} longitude={location.longitude}>
                            {viewState.zoom > 16 && <Card className={`border-${current.active ? "success" : "default"} border-2 overflow-visible w-[280px]`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color={current.active ? "success" : "default"} size='sm'>{current.active ? "Active" : "Inactive"}</Chip>
                                <CardBody className='flex flex-col gap-4'>
                                    <div className='flex flex-row gap-2'>
                                        <Avatar src={current.user.avatar_url} name={current.user.username}/>
                                        <div className='flex flex-col w-2/3'>
                                            <span className='font-bold'>{current.user.username}</span>
                                            <span className='text-foreground/50'>{current.user.bio}</span>
                                        </div>
                                    </div>
                                    <span className='font-bold text-lg'>{current.title}</span>
                                    <div className='p-2 border-2 border-content2 rounded-xl'>
                                    <span className='text-foreground/50 line-clamp-2'>{current.description}</span>
                                    </div>
                                    <div className='flex flex-row flex-wrap gap-1 w-full'>
                                        <Chip size='sm' variant='dot' color={gamesData[current.game].color}>{gamesData[current.game].short}</Chip>
                                        {
                                            current.formats.map((format) => (
                                                <Chip key={format.key} size='sm' variant='bordered'>
                                                {format.label}
                                                </Chip>
                                            ))
                                        }
                                        
                                    </div>
                                    
                                </CardBody>
                            </Card>}
                            {viewState.zoom < 16 && 
                            <div className={`relative p-2 px-4 rounded-full bg-content1 text-foreground border-${current.active ? "success" : "default"} border-2`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color={current.active ? "success" : "default"} size='sm'>{current.active ? "Active" : "Inactive"}</Chip>
                                <span>You</span>
                            </div>
                            }
                        </Marker>
                }

                {activeUsers.map((player) => {
                    return (
                        <Marker key={player.user.user_id} className={`${outfit.className}`} latitude={player.latitude} longitude={player.longitude}>
                            {viewState.zoom > 16 && 
                            <Card className={`border-success border-2 overflow-visible w-[280px]`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color="success" size='sm'>Active Player</Chip>
                                <CardBody className='flex flex-col gap-4'>
                                    <div className='flex flex-row gap-2'>
                                        <Avatar src={player.user.avatar_url} name={player.user.username}/>
                                        <div className='flex flex-col w-2/3'>
                                            <span className='font-bold'>{player.user.username}</span>
                                            <span className='text-foreground/50'>{player.user.bio}</span>
                                        </div>
                                    </div>
                                    <span className='font-bold text-lg'>{player.title}</span>
                                    <div className='p-2 border-2 border-content2 rounded-xl'>
                                    <span className='text-foreground/50 line-clamp-2'>{player.description}</span>
                                    </div>
                                    <div className='flex flex-row flex-wrap gap-1 w-full'>
                                        <Chip size='sm' variant='dot' color={gamesData[player.game].color}>{gamesData[player.game].short}</Chip>
                                        {
                                            player.formats.map((format) => (
                                                <Chip key={format.key} size='sm' variant='bordered'>
                                                {format.label}
                                                </Chip>
                                            ))
                                        }
                                    </div>
                                    <div className='w-full flex flex-col gap-2'>
                                        <Button
                                        size='sm' 
                                        className='w-full'
                                        color='primary'>
                                            Message {player.user.username}
                                        </Button>
                                        <Button
                                        size='sm' 
                                        className='w-full'
                                        color='default'
                                        variant='bordered'>
                                            View profile
                                        </Button>
                                    </div>
                                    
                                </CardBody>
                            </Card>
                            }
                            {viewState.zoom < 16 && 
                            <div className={`relative p-2 px-4 rounded-full bg-content1 text-foreground border-success border-2`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color="success" size='sm'>Active</Chip>
                                <span>{player.user.username}</span>
                            </div>
                            }
                        </Marker>
                    )
                })}
                

                {/* Event Markers */}
                {!isLoading && events && events.map((event) => {
                    //const starting = fromDate(event.start_date, getLocalTimeZone())
                    //const dateNow = now(getLocalTimeZone()) 
                    const startingString = timeAgo.format(new Date(event.start_date))
                    const endingString = timeAgo.format(new Date(event.end_date))

                    let chipColor: "default" | "primary" | "warning" | "success" | "danger" = "warning"

                    let dateString = ""
                    if(startingString.startsWith('in')) {
                        dateString = "Starting " + startingString
                        chipColor = "success"
                    }
                    else if (startingString.endsWith('ago') && endingString.startsWith('in')) {
                        dateString = "Ongoing, ending " + endingString
                        chipColor = "warning"
                    }
                    else if (endingString.endsWith('ago')) {
                        dateString = "Ended " + endingString
                        chipColor = "danger"
                    } else if (startingString.endsWith('now')) {
                        dateString = "Started " + startingString
                        chipColor = "warning"
                    }
                    else if (endingString.endsWith('now')) {
                        dateString = "Ended " + startingString
                        chipColor = "warning"
                    }

                    return (
                        <Marker key={event.id} className={`${outfit.className}`} latitude={event.latitude} longitude={event.longitude}>
                            {viewState.zoom > 14 && <Card className={`border-warning border-2 overflow-visible w-[280px]`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color="warning" size='sm'>{gamesData[event.game].label}</Chip>
                                <CardBody className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <Avatar src={event.host.avatar_url} name={event.host.username}/>
                                        <div className='flex flex-col w-2/3'>
                                            <span className='font-bold'>{event.title}</span>
                                            <span className='text-foreground/50'>Hosted by: {event.host.username!}</span>
                                            <span className='text-foreground/50 line-clamp-2'>{event.description}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-full'>
                                        <Chip color='default' size='sm' variant='dot'>{event.format.label}</Chip>
                                        <Chip variant='dot' classNames={{content: 'line-clamp-1'}} color={chipColor} size='sm'>{dateString}</Chip>
                                    </div>
                                    <div className='w-full'>
                                        <Button
                                        onPress={() => {
                                            setOpenEvent(event)
                                            onOpenEvent()
                                        }}
                                        size='sm' 
                                        className='w-full'
                                        color='primary'>
                                            View more
                                        </Button>
                                    </div>
                                    
                                </CardBody>
                            </Card>}
                            {viewState.zoom < 14 && 
                            <div className={`relative p-2 px-4 rounded-full bg-content1 text-foreground border-warning border-2`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color="warning" size='sm'>{gamesData[event.game].short}</Chip>
                                <span>{event.format.label}</span>
                            </div>
                            }
                        </Marker>
                    )
                })}

                {/* Player Marker */}
                {!current && location && <Marker className="flex flex-col items-center" latitude={location.latitude || 0} longitude={location.longitude}>
                        <Badge className='w-4 h-4 p-0' color='success'>
                            <Avatar src={user?.avatar_url}></Avatar>
                        </Badge>
                    </Marker>}


                <div className={`${outfit.className} absolute flex flex-row gap-2 justify-between left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 top-[64px]`}>
                    <div className='w-fit flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button 
                        size='lg'
                        onPress={() => onOpenFilters()}
                        className='my-auto' radius='full' color='primary'>Filters</Button>
                    </div>
                    <div className='w-fit flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button radius='full' 
                        size='lg'
                        onPress={() => onOpen()}
                        color='primary'
                        startContent={<RiAddFill size={24}/>}>Host</Button>
                    </div>
                </div>

                {!isLoadingStatus && <div className={`${outfit.className} absolute flex flex-row gap-2 left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 bottom-[24px]`}>
                    <div className='w-fit max-w-md mx-auto flex flex-col gap-2 h-fit p-2 bg-background/50 rounded-2xl backdrop-blur-lg border-1 border-foreground/10'>
                        {!current && 
                        <Button size='lg' 
                        onPress={() => onOpenStatus()}
                        color='primary'
                        startContent={<RiScan2Fill size={24}/>}>
                            Set up an active status
                        </Button>}
                        {current && 
                        <div className='flex flex-row gap-2'>
                            <Button 
                            onPress={() => {
                                toggleActive(!current.active)
                            }}
                            className='w-[90%]' size='lg' color={current.active ? "success" : "default"}>
                                Looking For: {current.active ? "Active" : "Inactive"}
                            </Button>
                            <Button 
                            onPress={() => onOpenStatus()}
                            isIconOnly size='lg' variant='faded' color="default" startContent={<RiEdit2Fill size={20}/>}/>
                        </div>
                        }
                        <span className='text-foreground/50 text-center px-8'>An active status means your location is shared in real-time with other players. Turn it off when you don&apos;t want to show up on the map</span>
                    </div>
                </div>}

                <Drawer size='lg' radius='lg' classNames={{
                    base: "h-[100vh] w-[300px] bg-background",
                    closeButton:'top-2 right-2'
                }} className='text-foreground' placement="left" backdrop="transparent" isOpen={isOpenFilters} onOpenChange={onOpenChangeFilters}>
                    <DrawerContent>
                        {() => (
                            <>
                            <DrawerHeader>
                                Filters
                            </DrawerHeader>
                            <DrawerBody>
                                <Select size='lg' label="TCG" 
                                className='text-foreground w-full'
                                onSelectionChange={(e) => {
                                    if(e.currentKey === "mtg" || e.currentKey === "pokemon" || e.currentKey === "yugioh" || e.currentKey === "other" || e.currentKey === "all")
                                    setGame(e.currentKey)
                                }}
                                selectionMode='single'
                                selectedKeys={[game]}>
                                    <SelectItem className='text-foreground p-3' key="all">All</SelectItem>
                                    <SelectItem className='text-foreground p-3' key="mtg">Magic: The Gathering</SelectItem>
                                    <SelectItem className='text-foreground p-3' key="pokemon">Pokemon</SelectItem>
                                    <SelectItem className='text-foreground p-3' key="yugioh">Yu-Gi-Oh!</SelectItem>
                                    <SelectItem className='text-foreground p-3' key="other">Other</SelectItem>
                                </Select>
                                <Select isDisabled={game === "all"} size='lg' label="Format" className='text-foreground w-full'>
                                    <SelectItem className='text-foreground' key="any">Any</SelectItem>
                                    <SelectSection>
                                    {playStyleData[game === "all" ? "mtg" : game].map((item) => (
                                        <SelectItem className='text-foreground p-3' key={item.key}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                    </SelectSection>
                                </Select>
                                <Button color='primary' isDisabled size='lg' className='mt-8'>Apply filters</Button>
                            </DrawerBody>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>

                <Drawer isDismissable={false} radius='lg' classNames={{
                    base: "min-h-[80vh] bg-background",
                }} className='text-foreground' placement="bottom" backdrop="transparent" isOpen={isOpenStatus} onOpenChange={onOpenChangeStatus}>
                    <DrawerContent>
                        {(onClose) => (
                            <>
                            <DrawerHeader>
                                <span className='text-2xl font-bold'>Set up an active status</span>
                            </DrawerHeader>
                            <DrawerBody>
                                <AddStatusForm onClose={onClose}/>
                            </DrawerBody>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>

                <Drawer isDismissable={false} radius='lg' classNames={{
                    base: "min-h-[100vh] bg-background",
                }} className='text-foreground' placement="bottom" backdrop="transparent" isOpen={isOpen} onOpenChange={onOpenChange}>
                    <DrawerContent>
                        {(onClose) => (
                            <>
                            <DrawerHeader>
                                <span className='text-2xl font-bold'>Host an event</span>
                            </DrawerHeader>
                            <DrawerBody>
                                <AddEventForm onClose={onClose}/>
                            </DrawerBody>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>

                <Drawer size='lg' radius='lg' classNames={{
                    base: "h-[100vh] bg-background",
                    closeButton:'top-2 right-2'
                }} className='text-foreground' placement="right" backdrop="transparent" isOpen={isOpenEvent} onOpenChange={onOpenChangeEvent}>
                    <DrawerContent>
                        {(onClose) => {
                            if(openEvent) return (
                                <>
                                <DrawerHeader className='flex flex-col gap-2'>
                                    <span className="text-3xl font-bold text-foreground">{openEvent.title}</span>
                                    <div className="flex flex-row gap-2">
                                        <span className={`text-${gamesData[openEvent.game].color}`}>{gamesData[openEvent.game].label}</span>
                                        <Chip color={gamesData[openEvent.game].color}>{openEvent.format.label}</Chip>
                                    </div>
                                </DrawerHeader>
                                <DrawerBody>
                                    <EventDetails onClose={onClose} id={openEvent.id}/>
                                </DrawerBody>
                                </>
                            )
                        }}
                    </DrawerContent>
                </Drawer>
                

            </Map>
        )
    }
}

export default MapSection

/* 

<div className='absolute outfit_70bd815a-module__Y975-W__className flex flex-row gap-2 justify-between left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 bottom-[72px]'>
                    <div className='w-full flex flex-col gap-4 h-fit p-4 bg-background/50 rounded-2xl backdrop-blur-lg border-1 border-foreground/10'>
                            <Slider size='sm' label="Range" className='text-foreground/50'
                             defaultValue={50}
                            getValue={(value) => `${value} miles`}/>
                            <Button size='lg' color='primary'>Scan for games!</Button>
                    </div>
                </div>



                <span className={`font-bold text-base text-foreground outfit_70bd815a-module__Y975-W__className`}>{user?.username}</span>
*/