import Navigation from "../navigation/navigation";

export default function GeneralLayout(
    {children}: Readonly<{children: React.ReactNode}>
) {
    return (
        <main className="min-h-dvh w-full flex flex-col bg-gradient-to-b from-0% from-content2 to-50% to-background">
            <Navigation/>
            {/* Page content */}
            <div className="mx-auto flex-1 flex flex-col p-4 max-w-[1280px]">
                {children}
            </div>
        </main>
    )
}