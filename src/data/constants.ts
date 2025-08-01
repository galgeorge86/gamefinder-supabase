import { RiCalendarFill, RiChat1Fill, RiHome3Fill, RiUser3Fill } from "react-icons/ri"

const playStyleData = {
    mtg: [
        {
            key: "standard",
            label: "Standard"
        },
        {
            key: "commander",
            label: "Commander"
        },
        {
            key: "thg",
            label: "Two Headed Giant"
        },
        {
            key: "cedh",
            label: "Competitive EDH"
        },
        {
            key: "canadian-highlander",
            label: "Canadian Highlander"
        },
        {
            key: "modern",
            label: "Modern"
        },
        {
            key: "draft",
            label: "Draft"
        },
        {
            key: "pauper",
            label: "Pauper"
        },
        {
            key: "other",
            label: "Other"
        },
    ]
}

const playLocationsData = [
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

const statusArray = [
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

const tabsArray = [
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

export {playStyleData, playLocationsData, statusArray, tabsArray}