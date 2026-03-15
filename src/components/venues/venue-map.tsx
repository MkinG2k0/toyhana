"use client"

import { cn } from "@/lib/utils"

interface VenueMapProps {
  latitude: number
  longitude: number
  name: string
  className?: string
}

export const VenueMap = ({
  latitude,
  longitude,
  name,
  className,
}: VenueMapProps) => {
  const mapUrl = `https://yandex.ru/map-widget/v1/?pt=${longitude},${latitude}&z=15&l=map&text=${encodeURIComponent(name)}`

  return (
    <div className={cn("overflow-hidden rounded-xl", className)}>
      <iframe
        src={mapUrl}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        title={`Карта — ${name}`}
        className="rounded-xl"
      />
    </div>
  )
}
