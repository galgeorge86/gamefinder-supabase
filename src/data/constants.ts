import { RiCalendarFill, RiChat1Fill, RiHome3Fill, RiInformation2Fill, RiMap2Fill, RiNotification3Fill, RiUser3Fill } from "react-icons/ri"

export const playStyleData = {
    mtg: [
        { key: "standard", label: "Standard" },
        { key: "commander", label: "Commander (EDH)" },
        { key: "thg", label: "Two Headed Giant" },
        { key: "cedh", label: "Competitive EDH" },
        { key: "ch", label: "Canadian Highlander" },
        { key: "modern", label: "Modern" },
        { key: "draft", label: "Draft" },
        { key: "pauper", label: "Pauper" },
        { key: "other", label: "Other" },
    ],
    yugioh: [
        { key: "advanced", label: "Advanced Format" },
        { key: "traditional", label: "Traditional Format" },
        { key: "goat", label: "Goat Format" },
        { key: "speed", label: "Speed Duel" },
        { key: "sealed", label: "Sealed/Draft" },
        { key: "other", label: "Other" },
    ],
    pokemon: [
        { key: "standard", label: "Standard" },
        { key: "expanded", label: "Expanded" },
        { key: "gymleader", label: "Gym Leader Challenge" },
        { key: "theme", label: "Theme Deck Battles" },
        { key: "limited", label: "Limited/Sealed" },
        { key: "other", label: "Other" },
    ],
    other: [
        { key: "flesh-and-blood-classic-constructed", label: "Flesh and Blood - Classic Constructed" },
        { key: "flesh-and-blood-blitz", label: "Flesh and Blood - Blitz" },
        { key: "lorcana-constructed", label: "Disney Lorcana - Constructed" },
        { key: "digimon-constructed", label: "Digimon Card Game - Constructed" },
        { key: "one-piece-constructed", label: "One Piece Card Game - Constructed" },
        { key: "other", label: "Other" },
    ]
};


export const gamesData : {
    mtg: {
        label: string,
        short: string,
        color: "default" | "primary" | "secondary" | "warning" | "danger" | "success"
    },
    pokemon: {
        label: string,
        short: string,
        color: "default" | "primary" | "secondary" | "warning" | "danger" | "success"
    },
    yugioh: {
        label: string,
        short: string,
        color: "default" | "primary" | "secondary" | "warning" | "danger" | "success"
    },
    other: {
        label: string,
        short: string,
        color: "default" | "primary" | "secondary" | "warning" | "danger" | "success"
    }
} = {
    mtg: {
        label: "Magic: The Gathering",
        short: "MTG",
        color: "warning"
    },
    pokemon: {
        label: "Pokemon",
        short: "Pokemon",
        color: "primary"
    },
    yugioh: {
        label: "Yu-Gi-Oh!",
        short: "YGO",
        color: "success"
    },
    other: {
        label: "Other",
        short: "Other",
        color: "secondary"
    }
}

export const playLocationsData = [
    {
        key: "lgs",
        label: "Local Game Store"
    },
    {
        key: "home",
        label: "Home"
    },
    {
        key: "other",
        label: "Other"
    }
]

export const statusArray = [
    {
        key: "offline",
        color: "default",
        label: "Offline"
    },
    {
        key: "online",
        color: "success",
        label: "Online"
    },
    {
        key: "searching",
        color: "warning",
        label: "Searching"
    }
]

export const tabsArray = [
    {
        icon: RiHome3Fill,
        label: "Home",
        path: '/'
    },
    {
        icon: RiCalendarFill,
        label: "Events",
        path: '/user/events'
    },
    {
        icon: RiChat1Fill,
        label: "Chat",
        path: '/user/chat'
    },
    {
        icon: RiUser3Fill,
        label: "Profile",
        path: '/user/profile'
    }
]

export const notificationTypes = {
    default: {
        key: "default",
        icon: RiNotification3Fill
    },
    event: {
        key: "event",
        icon: RiMap2Fill
    },
    chat: {
        key: "chat",
        icon: RiChat1Fill
    },
    info: {
        key: "info",
        icon: RiInformation2Fill
    }
}
