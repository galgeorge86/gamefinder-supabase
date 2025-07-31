'use client'

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers (
    {children}: Readonly<{children: React.ReactNode}>
) {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <ToastProvider toastProps={{
                    variant: 'flat',
                    size:'lg',
                    classNames: {
                        base: 'mt-8'
                    }
                }} placement="top-center"/>
                {children}
            </HeroUIProvider>
        </QueryClientProvider>
    )
}