"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { VenuePhoto } from "@/entities/venue";

interface VenueGalleryProps {
  photos: VenuePhoto[];
  venueName: string;
  className?: string;
}

export const VenueGallery = ({
  photos,
  venueName,
  className,
}: VenueGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayPhotos = photos.slice(0, 5);
  const hasMore = photos.length > 5;
  const isSinglePhoto = photos.length === 1;

  const handlePrev = () =>
    setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center rounded-xl bg-surface-100 md:h-96",
          className,
        )}
      >
        <p className="text-muted-foreground">Нет фотографий</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-2",
          !isSinglePhoto && "md:grid-cols-4 md:grid-rows-2",
          className,
        )}
      >
        <button
          onClick={() => handleOpen(0)}
          className={cn(
            "relative col-span-1 overflow-hidden aspect-16/9",
            isSinglePhoto
              ? "rounded-xl md:col-span-4"
              : "row-span-2 rounded-l-xl md:col-span-2 md:aspect-auto",
          )}
        >
          <Image
            src={displayPhotos[0]?.url ?? ""}
            alt={`${venueName} — фото 1`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform hover:scale-105"
            priority
          />
        </button>

        {displayPhotos.slice(1, 5).map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => handleOpen(i + 1)}
            className={cn(
              "relative hidden aspect-4/3 overflow-hidden md:block",
              i === 1 && "rounded-tr-xl",
              i === 3 && "rounded-br-xl",
            )}
          >
            <Image
              src={photo.url}
              alt={`${venueName} — фото ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform hover:scale-105"
            />
            {i === 3 && hasMore && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="flex items-center gap-1 text-sm font-medium text-white">
                  <Images className="size-4" />
                  Все фото ({photos.length})
                </span>
              </div>
            )}
          </button>
        ))}

        {photos.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-3 right-3 bg-white/90 md:hidden"
            onClick={() => handleOpen(0)}
          >
            <Images className="mr-1 size-4" />
            {photos.length} фото
          </Button>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-0 bg-black p-0">
          <div className="relative flex aspect-3/2 items-center justify-center">
            <Image
              src={photos[currentIndex]?.url ?? ""}
              alt={`${venueName} — фото ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="size-5" />
            </Button>
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
