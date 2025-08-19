'use client'

import { addToast, Button, Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Chip, Form, Input, Select, SelectItem, SelectSection, Spinner, Tab, Tabs, Textarea } from "@heroui/react"
import { ChangeEvent, FormEvent, useRef, useState } from "react"

import { RiMapFill, RiMapPinFill, RiUserAddFill } from "react-icons/ri"
import { playLocationsData, playStyleData } from "@/data/constants"
import { submitOnboarding } from "@/actions/user-actions"

interface Props {
    onSuccess: (username: string) => void
}

const OnboardingForm: React.FC<Props> = (props: Props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")
    const [playLocation, setPlayLocation] = useState("")

    const hiddenImageInput = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File>()
    const [imagePreview, setImagePreview] = useState("")

    const [mtgFormats, setMTGFormats] = useState<string[]>([])
    const [pokemonFormats, setPokemonFormats] = useState<string[]>([])
    const [yugiohFormats, setYugiohFormats] = useState<string[]>([])
    const [otherFormats, setOtherFormats] = useState<string[]>([])

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(username && location && playLocation) { // bio and image are not mandatory
            setIsLoading(true)

            const {message, status} = await submitOnboarding({
                username: username,
                bio: bio,
                location: location,
                image: image,
                mtg_formats: mtgFormats,
                pokemon_formats: pokemonFormats,
                yugioh_formats: yugiohFormats,
                other_formats: otherFormats,
                play_location: playLocation
            })
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
            props.onSuccess(username)
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
                                {mtgFormats.length != 0 && 
                                <span className="text-sm">Magic: The Gathering</span>
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {mtgFormats.map((key) => (
                                        <Chip color="warning" key={key.toString()}>{playStyleData.mtg.filter(item => item.key === key)[0].label}</Chip>
                                    ))}
                                </div>
                                {pokemonFormats.length != 0 && 
                                <span className="text-sm">Pokemon</span>
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {pokemonFormats.map((key) => (
                                        <Chip color="primary" key={key}>{playStyleData.pokemon.filter(item => item.key === key)[0].label}</Chip>
                                    ))}
                                </div>
                                {yugiohFormats.length != 0 && 
                                <span className="text-sm">Yu-Gi-Oh!</span>
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {yugiohFormats.map((key) => (
                                        <Chip color="success" key={key}>{playStyleData.yugioh.filter(item => item.key === key)[0].label}</Chip>
                                    ))}
                                </div>
                                {otherFormats.length != 0 && 
                                <span className="text-sm">Other</span>
                                }
                                <div className="flex flex-row gap-2 flex-wrap">
                                    {otherFormats.map((key) => (
                                        <Chip color="secondary" key={key}>{playStyleData.other.filter(item => item.key === key)[0].label}</Chip>
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
                        if(!username.match(/^[a-zA-Z0-9_.-]+$/)) return "Username can only contain letters, numbers, -, _ and ."
                    }}
                    errorMessage={({validationDetails}) => {
                        if(validationDetails.valueMissing) return "Please fill out this field"
                        if(username.length < 3) return "Username should be at least 3 characters long."
                        if(!username.match(/^[a-zA-Z0-9_.-]+$/)) return "Username can only contain letters, numbers, -, _ and ."
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
                    <Tabs classNames={{
                        base: "w-full",
                        tabList: "w-full items-center"
                    }}>
                        <Tab title="MTG" className="w-full">
                            <CheckboxGroup classNames={{
                                wrapper: "flex flex-row"
                            }}
                            value={mtgFormats}
                            onValueChange={(e) => {
                                setMTGFormats(e)
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
                        <Tab title="Pokemon" className="w-full">
                            <CheckboxGroup classNames={{
                                wrapper: "flex flex-row"
                            }}
                            value={pokemonFormats}
                            onValueChange={(e) => {
                                setPokemonFormats(e)
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
                        <Tab title="YGO" className="w-full">
                            <CheckboxGroup classNames={{
                                wrapper: "flex flex-row"
                            }}
                            value={yugiohFormats}
                            onValueChange={(e) => {
                                setYugiohFormats(e)
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
                        <Tab title="Other" className="w-full">
                            <CheckboxGroup classNames={{
                                wrapper: "flex flex-row"
                            }}
                            value={otherFormats}
                            onValueChange={(e) => {
                                setOtherFormats(e)
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

/* 

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
                        <SelectSection className="text-foreground/50" title="Pokemon">
                            {playStyleData.mtg.map((item, index) => (
                                <SelectItem className="text-foreground m-auto p-3" key={index}>{item.label}</SelectItem>
                            ))}
                        </SelectSection>
                        <SelectSection className="text-foreground/50" title="Yu-Gi-Oh">
                            {playStyleData.mtg.map((item, index) => (
                                <SelectItem className="text-foreground m-auto p-3" key={index}>{item.label}</SelectItem>
                            ))}
                        </SelectSection>
                    </Select>

*/