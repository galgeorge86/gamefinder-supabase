'use client'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker } from "react-map-gl/mapbox"
import useLocationStore from "@/stores/locationStore"
import { Avatar, Badge, Button, Card, CardBody, Chip, Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from "@heroui/react"
import useAuthStore from "@/stores/authStore"
import { TbLocationOff } from 'react-icons/tb'
import { RiAddFill } from 'react-icons/ri'
import { useEffect, useState} from 'react'
import useEventStore, { Event } from '@/stores/eventStore'
import { Outfit } from 'next/font/google'

//Force client, required for the useGeocodingCore hook (otherwise it throws 'document is undefined' error)
import dynamic from 'next/dynamic';
const AddEventForm = dynamic(() => import('./add-event-form.tsx'), { ssr: false });


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"]
})

const MapSection: React.FC = () => {

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const { location } = useLocationStore()
    const { user } = useAuthStore()
    const {events, getEvents, isLoading} = useEventStore()
    const {isOpen, onOpen, onOpenChange} = useDisclosure()

    const [openEvent, setOpenEvent] = useState<Event | null>()

    const {isOpen: isOpenEvent, onOpen: onOpenEvent, onOpenChange: onOpenChangeEvent} = useDisclosure()

    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 3.5
    });

    // TODO: Add controlled zoom and custom event markers based on zoom (full card when zoomed-in / bubble when zoomed out)

    // Get events
    useEffect(() => {
        if(viewState.latitude == 0 || viewState.longitude == 0)
            setViewState({
                longitude: location?.long || 0,
                latitude: location?.lat || 0,
                zoom: 3.5
            })
        if(isLoading)
            getEvents()
    }, [isLoading])

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
            style={{width: 'screen', height:'screen', position:'absolute', left: 0, right: 0, top: 0, bottom: 0}}
            mapboxAccessToken={accessToken}
            mapStyle={"mapbox://styles/galgeorge86/cmdvucxci00dr01pj6uwkhrhi"}
            maxZoom={20}
            >
                {/* Player Marker */}
                {location && <Marker className="flex flex-col items-center" latitude={location.lat || 0} longitude={location.long}>
                        <Badge className='w-4 h-4 p-0' color='success'>
                            <Avatar src={user?.avatar_url}></Avatar>
                        </Badge>
                    </Marker>}

                {/* Event Markers */}
                {!isLoading && events && events.map((event) => {
                    return (
                        <Marker key={event.id} className={`${outfit.className}`} latitude={event.latitude} longitude={event.longitude}>
                            {viewState.zoom > 13 && <Card className={`border-warning border-2 overflow-visible w-[180px]`}>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color='warning' size='sm'>MTG</Chip>
                                <CardBody className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <Avatar src={event.host.avatar_url} name={event.host.username}/>
                                        <div className='flex flex-col w-2/3'>
                                            <span className='font-bold'>{event.title}</span>
                                            <span className='text-foreground/50'>Hosted by: {event.host.username!}</span>
                                            <span className='text-foreground/50 line-clamp-3'>{event.description}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 w-full'>
                                        <Chip color='default' size='sm' variant='dot'>{event.format.label}</Chip>
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
                            {viewState.zoom < 13 && 
                            <div className='relative p-2 px-4 rounded-full bg-content1 text-foreground border-warning border-2'>
                                <Chip className='absolute left-1/2 -translate-x-1/2 -top-4' color='warning' size='sm'>MTG</Chip>
                                <span>{event.format.label}</span>
                            </div>
                            }
                        </Marker>
                    )
                })}


                <div className={`${outfit.className} absolute flex flex-row gap-2 justify-between left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 top-[64px]`}>
                    <div className='w-fit flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button radius='full' color='primary'>Filters</Button>
                    </div>
                    <div className='w-fit flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button radius='full' 
                        onPress={() => onOpen()}
                        color='primary' isIconOnly 
                        startContent={<RiAddFill size={24}/>}/>
                    </div>
                </div>

                <Drawer isDismissable={false} radius='lg' classNames={{
                    base: "min-h-[90vh] bg-background",
                }} className='text-foreground' placement="bottom" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
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
                }} className='text-foreground' placement="right" backdrop="transparent" isOpen={isOpenEvent} onOpenChange={onOpenChangeEvent}>
                    <DrawerContent>
                        {() => (
                            <>
                            <DrawerHeader>
                                <span className='text-2xl font-bold'>{openEvent?.title}</span>
                            </DrawerHeader>
                            <DrawerBody>
                            </DrawerBody>
                            </>
                        )}
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