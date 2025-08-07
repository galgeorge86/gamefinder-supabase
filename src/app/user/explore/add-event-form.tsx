'use client'

import { playStyleData } from "@/data/constants"
import { addToast, Autocomplete, AutocompleteItem, Button, DatePicker, Form, Input, Select, SelectItem, Slider, Spinner, Textarea } from "@heroui/react"
import { getLocalTimeZone, now, parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { useGeocodingCore } from "@mapbox/search-js-react";
import { FormEvent, useState } from "react";
import { GeocodingFeature } from "@mapbox/search-js-core";
import { useAsyncList } from "@react-stately/data";
import { addEvent } from "@/actions/event-actions";
import useEventStore from "@/stores/eventStore";


interface Props {
    onClose: () => void
}

const AddEventForm: React.FC<Props> = (props: Props) => {
    const geocode = useGeocodingCore({accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!})

    const [startingDate, setStartingDate] = useState<ZonedDateTime | null>(parseAbsoluteToLocal(now(getLocalTimeZone()).add({hours: 1}).toAbsoluteString()));
    const [endingDate, setEndingDate] = useState<ZonedDateTime | null>(parseAbsoluteToLocal(now(getLocalTimeZone()).add({hours: 2}).toAbsoluteString()));

    const [coords, setCoords] = useState<{latitude: number, longitude: number} | null>()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [maximumPlayers, setMaximumPlayers] = useState(4)

    const [fullAddress, setFullAddress] = useState("")
    const [address, setAddress] = useState("")
    const [place, setPlace] = useState<string>("")
    const [region, setRegion] = useState<string>("")
    const [country, setCountry] = useState<string>("")
    const [postalCode, setPostalCode] = useState<string>("")

    const [game, setGame] = useState<"mtg">("mtg")
    const [format, setFormat] = useState<{key: string, label: string}>(playStyleData.mtg[1])

    const [isLoading, setIsLoading] = useState(false)

    const {getEvents} = useEventStore()

    const list = useAsyncList<GeocodingFeature>({
        async load({signal, filterText}) {
            const res = await geocode.forward(filterText!, {signal: signal, autocomplete: true, permanent: true})
            return {
                items: res.features || null
            }
        },
    });

    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(title, description, maximumPlayers, startingDate, endingDate, format, coords)
        if(title && maximumPlayers && startingDate && endingDate && format && coords) {
            setIsLoading(true)
            const res = await addEvent({
                title: title as string,
                description: description as string,
                maximumPlayers: maximumPlayers as number,
                startDate: startingDate.toDate(),
                endDate: endingDate.toDate(),
                game: "mtg",
                format: format,
                fullAddress: fullAddress,
                address: address,
                place: place,
                region: region,
                country: country,
                coordinates: coords,
                postalCode: postalCode
            })
            if(res.status !== 200) {
                setIsLoading(false)
                addToast({
                    color: 'danger',
                    title: 'Add event',
                    description: res.message
                })
            } else {
                addToast({
                    color: 'success',
                    title: 'Add event',
                    description: res.message
                })
                getEvents()
                props.onClose()
            }
        }
    }


    return (
        <Form onSubmit={handleSubmit} className="w-full mx-auto md:w-md">
            <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            isRequired
            size="lg"
            label="Event name"
            />
            <Autocomplete
            inputValue={list.filterText}
            isLoading={list.isLoading}
            items={list.items}
            className="w-full"
            name="address"
            isRequired
            size="lg"
            label="Address"
            onInputChange={list.setFilterText}
            onSelectionChange={(key) => {
                const selected = list.items.filter((item) => item.id === key)[0]
                if(selected) {
                    setCoords({
                        latitude: selected.properties.coordinates.latitude,
                        longitude: selected.properties.coordinates.longitude
                    })
                    setFullAddress(selected.properties.full_address)
                    setAddress(selected.properties.context.address?.name || "")
                    setCountry(selected.properties.context.country?.name || "")
                    setPlace(selected.properties.context.place?.name || "")
                    setRegion(selected.properties.context.region?.name || "")
                    setPostalCode(selected.properties.context.postcode?.name || "")
                } else {
                    setCoords(null)
                    setFullAddress("")
                    setAddress("")
                    setCountry("")
                    setPlace("")
                    setRegion("")
                }
            }}
            > 
                {(item) => (
                    <AutocompleteItem key={item.id} className="capitalize py-3 text-foreground">
                    {item.properties.full_address}
                    </AutocompleteItem>
                )}
            </Autocomplete>

            {coords && fullAddress && 
            <span className="text-xs text-foreground/50">
                Full address: {fullAddress}<br/> 
                Coordinates: lat {coords.latitude}, long {coords.longitude}
            </span>}
            
            <div className="flex flex-row w-full gap-2">
                <Select
                onSelectionChange={(keys) => {
                    // TODO: Change to allow other games
                    if(keys.currentKey === "mtg"){
                        setGame(keys.currentKey)
                    }
                }}
                isRequired
                defaultSelectedKeys={[game]}
                isDisabled
                label="Game">
                    <SelectItem key={"mtg"}>Magic: The Gathering</SelectItem>
                </Select>

                <Select
                isRequired
                onSelectionChange={(keys) => {
                    const selected = playStyleData[game].filter((item) => item.key === keys.currentKey)[0]
                    setFormat(selected)
                }}
                defaultSelectedKeys={["commander"]}
                label="Format">
                    {
                        playStyleData.mtg.map((item) => (
                            <SelectItem className="text-foreground py-3" key={item.key}>{item.label}</SelectItem>
                        ))
                    }
                </Select>
            </div>
            <Slider
            name="maximumPlayers"
            color="primary"
            onChange={(e) => {
                if(typeof e == "number")
                    setMaximumPlayers(e)
            }}
            defaultValue={4}
            minValue={2}
            maxValue={12}
            label="Maximum players"
            />
            
            <DatePicker size="lg"
            granularity="minute"
            description="Event must start at least an hour from now."
            minValue={startingDate || parseAbsoluteToLocal(now(getLocalTimeZone()).add({hours: 1}).toAbsoluteString())}
            value={startingDate}
            onChange={setStartingDate}
            label="Starts at:"
            />
            <DatePicker size="lg"
            granularity="minute"
            description="Event must be at least an hour long."
            minValue={startingDate?.add({hours: 1}) || parseAbsoluteToLocal(now(getLocalTimeZone()).add({hours: 2}).toAbsoluteString())}
            value={endingDate}
            onChange={setEndingDate}
            label="Ends at:"
            />

            <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            label="Event description / details"
            placeholder="e.g. House rules, location information, amenities, what to bring etc."/>

            <Button isDisabled={isLoading} type="submit" className="w-full" size="lg" color="primary">
                {isLoading ? <Spinner color="white"/> : "Host event" }
            </Button>
            <Button isDisabled={isLoading} onPress={props.onClose} className="w-full" size="lg" variant="bordered" color="default">
                Cancel
            </Button>
        </Form>
    )
}

export default AddEventForm

/*let res = await autofill.suggest(filterText!, {sessionToken: 'test'});
            console.log(res)
            return {
                items: res.suggestions,
            };*/