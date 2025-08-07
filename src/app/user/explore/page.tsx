'use client'

import GeneralLayout from "@/components/layouts/generalLayout";
import MapSection from "./map-section";

export default function ExplorePage() {
  return (
    <GeneralLayout>
      {/* Adjusted absolute margins so Mapbox logo and credits are visible on mobile */}
      <div className="absolute top-0 md:bottom-0 bottom-[72px] left-0 right-0 ">
        <MapSection/>
      </div>
    </GeneralLayout>
  );
}
