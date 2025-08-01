'use client'

import GeneralLayout from "@/components/layouts/generalLayout";

export default function ExplorePage() {
  return (
    <GeneralLayout>
      <div className="w-full bg-radial m-auto flex flex-col gap-8 text-foreground text-center">
        <div className="flex flex-col">
          <span className="font-bold text-3xl">Events</span>
          <span className="text-foreground/50">View your upcoming events!</span>
        </div>
      </div>
    </GeneralLayout>
  );
}
