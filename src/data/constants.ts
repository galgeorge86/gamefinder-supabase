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

export {playStyleData, playLocationsData, statusArray}