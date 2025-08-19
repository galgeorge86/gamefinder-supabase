'use client'

import { deleteUserLookingFor, upsertUserLookingFor } from "@/actions/looking-for-actions";
import { playStyleData } from "@/data/constants"
import { useLookingForStore } from "@/stores/lookingForStore";
import { createClient } from "@/utils/supabase/client";
import { addToast, Button, Checkbox, CheckboxGroup, Form, Input, PressEvent, Spinner, Tab, Tabs, Textarea } from "@heroui/react"
import { FormEvent, useState } from "react";


interface Props {
    onClose: () => void
}

const AddStatusForm: React.FC<Props> = (props: Props) => {

    const {location, current} = useLookingForStore()

    const [title, setTitle] = useState(current?.title || "")
    const [description, setDescription] = useState(current?.description || "")

    const [game, setGame] = useState<"mtg" | "yugioh" | "pokemon" | "other">(current?.game || "mtg")
    const [formats, setFormats] = useState<string[]>(current?.formats.map(item => item.key) || [])

    const {setCurrent} = useLookingForStore()

    const [isLoading, setIsLoading] = useState(false)

    const supabase = createClient()
    const lookingForChannel = supabase.channel('players-looking-for')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(title && game && formats && location) {
            setIsLoading(true)

            const res = await upsertUserLookingFor({
                title: title,
                latitude: location.latitude,
                longitude: location.longitude,
                game: game,
                formats: formats,
                description: description,
                tags: []
            })
            if(res.status !== 200) {
                setIsLoading(false)
                addToast({
                    color: 'danger',
                    title: current ? "Updating status" : "Creating status",
                    description: res.message
                })
            } else {
                if(res.player) {
                    addToast({
                        color: 'success',
                        title: current ? "Updating status" : "Creating status",
                        description: res.message
                    })
                    lookingForChannel.send({
                        type: 'broadcast',
                        event: 'upsert-player',
                        payload: {
                            player: res.player
                        }
                    })
                    setCurrent({...res.player, active: true})
                    props.onClose()
                }
            }
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        const res = await deleteUserLookingFor()
        if(res.status !== 200) {
            setIsLoading(false)
            addToast({
                color: 'danger',
                title: 'Deleting status',
                description: res.message
            })
        } else {
            if(res.user_id) {
                addToast({
                    color: 'success',
                    title: 'Deleting status',
                    description: 'Successfully deleted status.'
                })
                lookingForChannel.send({
                    type: 'broadcast',
                    event: 'delete-player',
                    payload: {
                        user_id: res.user_id
                    }
                })
                setCurrent(null)
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
            label="Status title"
            placeholder="e.g. Anyone down for some EDH?"
            />
            
            <Tabs selectedKey={game} 
            onSelectionChange={(key) => {
                if(key === "mtg" || key === "pokemon" || key === "yugioh" || key === "other") {
                    setFormats([])
                    setGame(key)
                }
            }} 
            classNames={{
                base: "w-full",
                tabList: "w-full items-center"
            }}>
                        <Tab key="mtg" title="MTG" className="w-full">
                            <CheckboxGroup isRequired classNames={{
                                wrapper: "flex flex-row"
                            }}
                            errorMessage={(e) => {
                                if(e.validationDetails.valueMissing) 
                                    return "Please select at least a format form the list."
                            }}
                            value={formats}
                            onValueChange={(e) => {
                                setFormats(e)
                            }}>
                            {playStyleData.mtg.map((item) => (
                                <Checkbox classNames={{
                                    base:
                                    `w-full flex flex-row-reverse m-0 bg-background border-divider items-center
                                    cursor-pointer rounded-xl gap-4 p-2 border-2
                                    duration-100
                                    data-[selected=true]:bg-warning data-[selected=true]:border-transparent`,
                                    wrapper: "hidden"
                                }} value={item.key} key={item.key} className="">{item.label}</Checkbox>
                            ))}
                            </CheckboxGroup>
                        </Tab>
                        <Tab key="pokemon" title="Pokemon" className="w-full">
                            <CheckboxGroup isRequired classNames={{
                                wrapper: "flex flex-row"
                            }}
                            errorMessage={(e) => {
                                if(e.validationDetails.valueMissing) 
                                    return "Please select at least a format form the list."
                            }}
                            value={formats}
                            onValueChange={(e) => {
                                setFormats(e)
                            }}>
                            {playStyleData.pokemon.map((item) => (
                                <Checkbox classNames={{
                                    base:
                                    `w-full flex flex-row-reverse m-0 bg-background border-divider items-center
                                    cursor-pointer rounded-xl gap-4 p-2 border-2
                                    duration-100
                                    data-[selected=true]:bg-primary data-[selected=true]:border-transparent`,
                                    wrapper: "hidden"
                                }} value={item.key} key={item.key} className="">{item.label}</Checkbox>
                            ))}
                            </CheckboxGroup>
                        </Tab>
                        <Tab key="yugioh" title="YGO" className="w-full">
                            <CheckboxGroup isRequired classNames={{
                                wrapper: "flex flex-row"
                            }}
                            errorMessage={(e) => {
                                if(e.validationDetails.valueMissing) 
                                    return "Please select at least a format form the list."
                            }}
                            value={formats}
                            onValueChange={(e) => {
                                setFormats(e)
                            }}
                            >
                            {playStyleData.yugioh.map((item) => (
                                <Checkbox classNames={{
                                    base:
                                    `w-full flex flex-row-reverse m-0 bg-background border-divider items-center
                                    cursor-pointer rounded-xl gap-4 p-2 border-2
                                    duration-100
                                    data-[selected=true]:bg-success data-[selected=true]:border-transparent`,
                                    wrapper: "hidden"
                                }} value={item.key} key={item.key} className="">{item.label}</Checkbox>
                            ))}
                            </CheckboxGroup>
                        </Tab>
                        <Tab key="other" title="Other" className="w-full">
                            <CheckboxGroup isRequired classNames={{
                                wrapper: "flex flex-row"
                            }}
                            errorMessage={(e) => {
                                if(e.validationDetails.valueMissing) 
                                    return "Please select at least a format form the list."
                            }}
                            value={formats}
                            onValueChange={(e) => {
                                setFormats(e)
                            }}>
                            {playStyleData.other.map((item) => (
                                <Checkbox classNames={{
                                    base:
                                    `w-full flex flex-row-reverse m-0 bg-background border-divider items-center
                                    cursor-pointer rounded-xl gap-4 p-2 border-2
                                    duration-100
                                    data-[selected=true]:bg-default data-[selected=true]:border-transparent`,
                                    wrapper: "hidden"
                                }} value={item.key} key={item.key} className="">{item.label}</Checkbox>
                            ))}
                            </CheckboxGroup>
                        </Tab>
                    </Tabs>

            <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            label="Details"
            placeholder="Offer details about what you want to play (e.g. I play EDH, I've got the Eldrazi Unbound precon. Let's play!)"/>

            <Input isDisabled label="Tags" size="lg" placeholder="Coming soon :)"/>
            
            <div className="flex flex-col gap-2 mb-20 w-full">
                <Button isDisabled={isLoading} type="submit" className="w-full" size="lg" color="primary">
                    {isLoading ? <Spinner size="sm" color="white"/> : "Submit" }
                </Button>
                {current && <Button onPress={handleDelete} variant="bordered" isDisabled={isLoading} className="w-full" size="lg" color="danger">
                    {isLoading ? <Spinner size="sm" color="white"/> : "Remove status" }
                </Button>}
                <Button isDisabled={isLoading} onPress={props.onClose} className="w-full" size="lg" variant="bordered" color="default">
                    Cancel
                </Button>
            </div>
        </Form>
    )
}

export default AddStatusForm
