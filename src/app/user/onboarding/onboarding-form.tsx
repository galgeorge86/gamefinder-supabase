'use client'

import { addToast, Button, Card, CardBody, CardHeader, Chip, Form, Input, Select, SelectItem, SelectSection, SharedSelection, Spinner, Textarea } from "@heroui/react"
import { ChangeEvent, FormEvent, useRef, useState } from "react"

import { RiMapFill, RiMapPinFill, RiUserAddFill } from "react-icons/ri"
import { playLocationsData, playStyleData } from "@/data/constants"
import { redirect } from "next/navigation"

const OnboardingForm: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")
    const [playLocation, setPlayLocation] = useState("")

    const hiddenImageInput = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File>()
    const [imagePreview, setImagePreview] = useState("")

    const [playStyles, setPlayStyles] = useState<SharedSelection>()

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(username && location && playLocation && playStyles) { // bio and image are not mandatory
            setIsLoading(true)
            const playStylesArray = Array.from(new Set(playStyles)).map((key) => ({
                key: playStyleData.mtg[Number(key)].key,
                label: playStyleData.mtg[Number(key)].label,
            }))

            // Initialize FormData to send to API endpoint

            const formData = new FormData()
            formData.append('username', username)
            formData.append('bio', bio)
            formData.append('playStyles', JSON.stringify({mtg: playStylesArray}))
            formData.append('location', location)
            formData.append('playLocation', playLocation)
            if(image) {
                formData.append('image', image)
            }

            const res = await fetch('/api/user/submit-onboarding', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                },
                body: formData
            })
            const {message, status} = await res.json()
            if(status !== 200) {
                addToast({
                    color: 'danger',
                    title: "User onboarding",
                    description: message
                })
                setIsLoading(false)
                return;
            }
            setIsLoading(false)
            return redirect('/')
        }
    }

    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (FileReader && e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if(file.size >= 2 * 1024 * 1024) {
                addToast({
                    color: "danger",
                    title: "User onboarding",
                    description: "The maximum image size is 2MB."
                })
                return;
            }
            if(file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png") {
                addToast({
                    color: "danger",
                    title: "User onboarding",
                    description: "The file you uploaded is not allowed."
                })
                return;
            }
            const image_url = URL.createObjectURL(e.target.files[0])
            setImagePreview(image_url)
            setImage(e.target.files[0])
        }
    }

    const handleAddClick = () => {
        if(hiddenImageInput.current)
            hiddenImageInput.current.click()
    }

    return (
        <Card className="w-full md:w-xl p-2 md:p-4 bg-background">
            <CardHeader className="">
                <div className="flex flex-col w-full mx-auto items-center text-center">
                    <header className="font-bold text-2xl text-foreground">Welcome to the community!</header>
                    <span className="text-foreground/50">Complete your profile to start looking for friends!</span>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
                <Form onSubmit={handleFormSubmit}>

                    {/* Profile Preview */}

                    <div className="flex flex-col sm:flex-row w-full gap-4 p-4 border-1 border-foreground/10 rounded-2xl">
                        <div onClick={handleAddClick} className="mx-auto sm:ml-0 hover:opacity-60 duration-100 aspect-square overflow-hidden mt-0 mb-auto flex rounded-full w-[64px] bg-content2 dark:bg-content1">
                            {!imagePreview && <RiUserAddFill size={32} className="m-auto"/>}
                            {imagePreview && <img alt="avatar" className="object-cover w-full h-full" src={imagePreview}/>}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">{username}</span>
                                <span className="text-foreground/50 text-sm">
                                    {bio}
                                </span>
                                {location && <span className="text-foreground/50 text-sm my-auto items-center flex flex-row gap-1">
                                    <RiMapPinFill/> 
                                    {location}
                                </span>}
                                {playLocation && <span className="text-foreground/50 text-sm my-auto items-center flex flex-row gap-1">
                                    <RiMapFill/> 
                                    {playLocationsData.filter((item) => item.key === playLocation)[0].label}
                                </span>}
                            </div>
                            <div className="sm:flex flex-col gap-1">
                                {Array.from(new Set(playStyles)).length != 0 && 
                                <span className="text-sm">MTG Formats I play:</span>
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {Array.from(new Set(playStyles)).map((key) => (
                                        <Chip color="primary" key={key.toString()}>{playStyleData.mtg[Number(key)].label}</Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    

                    <input ref={hiddenImageInput} onChange={handleImage} type="file" className="hidden"/>

                    <Input
                    size="lg"
                    isRequired
                    minLength={3}
                    maxLength={24}
                    validate={(username) => {
                        if(username == "") return "Please fill out this field"
                        if(username.length < 3) return "Username should be at least 3 characters long."
                        if(!username.match(/^[a-zA-Z0-9_-]+$/)) return "Username can only contain letters, numbers, -, _ and ."
                    }}
                    errorMessage={({validationDetails}) => {
                        if(validationDetails.valueMissing) return "Please fill out this field"
                        if(username.length < 3) return "Username should be at least 3 characters long."
                        if(!username.match(/^[a-zA-Z0-9_-]+$/)) return "Username can only contain letters, numbers, -, _ and ."
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    name="username"
                    type="username"
                    label="Username"
                    className="mt-4"
                    />

                    <Textarea
                    size="lg"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself"
                    label="Bio"
                    name="bio"
                    minRows={3}
                    maxRows={3}
                    />

                    <Select
                    size="lg"
                    isRequired
                    maxListboxHeight={180}
                    selectionMode="multiple"
                    selectedKeys={playStyles}
                    placeholder="Select all that apply"
                    onSelectionChange={setPlayStyles}
                    label="Games and formats played">
                        <SelectSection className="text-foreground/50" title="Magic the Gathering">
                            {playStyleData.mtg.map((item, index) => (
                                <SelectItem className="text-foreground m-auto p-3" key={index}>{item.label}</SelectItem>
                            ))}
                        </SelectSection>
                    </Select>

                    <Input
                    size="lg"
                    isRequired
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    label="Location"
                    placeholder="City or region"
                    />

                    <Select
                    size="lg"
                    isRequired
                    onChange={(e) => setPlayLocation(e.target.value)}
                    label="Preferred play location">
                        <SelectSection className="text-foreground/50" title="Preferred play location">
                        {playLocationsData.map((item) => (
                            <SelectItem className="text-foreground p-3" key={item.key}>{item.label}</SelectItem>
                        ))}
                        </SelectSection>
                    </Select>


                    <Button 
                    type="submit" 
                    className="w-full mt-4" 
                    variant="solid" 
                    color="primary" size="lg" isDisabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white"/> : "Continue"}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default OnboardingForm