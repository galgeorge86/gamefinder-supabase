'use client'

import GeneralLayout from "@/components/layouts/generalLayout";

export default function ChatPage() {
  return (
    <GeneralLayout>
      <div className="w-full bg-radial m-auto flex flex-col gap-8 text-foreground text-center">
        <div className="flex flex-col">
          <span className="font-bold text-3xl">Chat</span>
          <span className="text-foreground/50">View your joined parties.</span>
        </div>
      </div>
    </GeneralLayout>
  );
}
