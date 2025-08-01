'use client'

import GeneralLayout from "@/components/layouts/generalLayout";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <GeneralLayout>
      <div className="w-full bg-radial m-auto flex flex-col gap-8 text-foreground text-center">
        <div className="flex flex-col">
          <span className="font-bold text-3xl">Welcome to GameFinder</span>
          <span className="text-foreground/50">A place for all TCG players to connect and meet up!</span>
        </div>
        <div className="flex flex-col gap-2 text-left">
          <span className="text-foreground/50">Currently supported games:</span>
          <div className="flex flex-row gap-2 max-w-md">
            <div className="rounded-xl border-1 border-content2 shadow-xl flex overflow-hidden bg-white w-1/2 p-4">
              <img alt="mtg-logo" src="/images/mtg-logo.png" className="w-full m-auto"/>
            </div>
            <div className="rounded-xl border-1 border-content2 shadow-xl flex overflow-hidden bg-content1 w-1/2 p-2">
              <span className="text-center items-center w-full m-auto text-foreground/50">...and more to come</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full">
          <Link href={'/auth/sign-up'} className="mx-auto">
            <Button className="m-auto bg-foreground text-background" radius="full" size="lg">
              Sign up now!
            </Button>
          </Link>
        </div>
      </div>
    </GeneralLayout>
  );
}
