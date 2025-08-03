'use client'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker } from "react-map-gl/mapbox"
import useLocationStore from "@/stores/locationStore"
import { Avatar, Badge, Button, Slider } from "@heroui/react"
import useAuthStore from "@/stores/authStore"
import { TbLocationOff } from 'react-icons/tb'
import { RiAddFill } from 'react-icons/ri'

const MapSection: React.FC = () => {

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    
    const {location, isActive} = useLocationStore()
    const {user} = useAuthStore()

    /*useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!!
        mapRef.current = new mapboxgl.Map({
            container: mapContianerRef.current
        })

        return () => {
            mapRef.current.remove()
        }
    }, [])*/

    if(!isActive) {
        return (
            <div className="w-full bg-radial m-auto flex flex-col gap-8 text-foreground text-center">
                <div className="flex flex-col">
                    <TbLocationOff size={64} className='mx-auto text-content3'/>
                    <span className="font-bold text-3xl mt-8">We can&apos;t access your location</span>
                    <span className="text-foreground/50">Make sure your browser has access to your location and turn on the switch in the top-right corner.</span>
                </div>
            </div>
        )
    }

    if(isActive) {
        return (
            <Map
            initialViewState={{
                longitude: location?.long,
                latitude: location?.lat,
                zoom: 3.5
            }}
            style={{width: 'screen', height:'screen', position:'absolute', left: 0, right: 0, top: 0, bottom: 0}}
            mapboxAccessToken={accessToken}
            mapStyle={"mapbox://styles/galgeorge86/cmdvucxci00dr01pj6uwkhrhi"}
            maxZoom={20}
            >
                {location && <Marker className="flex flex-col items-center" latitude={location.lat || 0} longitude={location.long}>
                        <Badge className='w-4 h-4 p-0' color='success'>
                            <Avatar src={user?.avatar_url}></Avatar>
                        </Badge>
                    </Marker>}

                <div className='absolute outfit_70bd815a-module__Y975-W__className flex flex-row gap-2 justify-between left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 top-[64px]'>
                    <div className='w-full flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button radius='full' color='primary'>Filters</Button>
                    </div>
                    <div className='w-fit flex flex-row gap-2 h-fit p-2 bg-background/50 rounded-full backdrop-blur-lg border-1 border-foreground/10'>
                        <Button radius='full' 
                        color='primary' isIconOnly 
                        startContent={<RiAddFill size={24}/>}/>
                    </div>
                </div>
                <div className='absolute outfit_70bd815a-module__Y975-W__className flex flex-row gap-2 justify-between left-1/2 -translate-x-1/2 w-screen xl:w-[1280px] p-2 bottom-[72px]'>
                    <div className='w-full flex flex-col gap-4 h-fit p-4 bg-background/50 rounded-2xl backdrop-blur-lg border-1 border-foreground/10'>
                            <Slider size='sm' label="Range" className='text-foreground/50'
                             defaultValue={50}
                            getValue={(value) => `${value} miles`}/>
                            <Button size='lg' color='primary'>Scan for games!</Button>
                    </div>
                </div>

            </Map>
        )
    }
}

export default MapSection

/* 


                <span className={`font-bold text-base text-foreground outfit_70bd815a-module__Y975-W__className`}>{user?.username}</span>
*/