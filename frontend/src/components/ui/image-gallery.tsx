"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Image {
  original: string;
  thumbnail: string;
}

interface ImageGalleryProps {
  items: Image[];
  showPlayButton?: boolean;
  showFullscreenButton?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export default function ImageGallery({
  items,
  showPlayButton = false,
  showFullscreenButton = false,
  autoPlay = false,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!api) return;

    api.scrollTo(selectedIndex, false);
  }, [api, selectedIndex]);

  useEffect(() => {
    if (!api || !isPlaying) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
        setSelectedIndex((prev) => prev + 1);
      } else {
        api.scrollTo(0, false);
        setSelectedIndex(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, isPlaying]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (api) {
      api.scrollTo(index, false);
    }
  };

  const handleNext = () => {
    if (api && api.canScrollNext()) {
      api.scrollNext();
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (api && api.canScrollPrev()) {
      api.scrollPrev();
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (items.length === 0) {
    return (
      <div className={cn("w-full h-96 bg-gray-200 flex items-center justify-center", className)}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Main Image Carousel */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={item.original}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onMouseEnter={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(autoPlay)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Play/Pause Button */}
        {showPlayButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="4" width="3" height="12" />
                <rect x="12" y="4" width="3" height="12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4l10 6-10 6V4z" />
              </svg>
            )}
          </Button>
        )}

        {/* Fullscreen Button */}
        {showFullscreenButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-2 left-2 bg-white/80 hover:bg-white"
            onClick={() => {
              // Simple fullscreen implementation
              const img = document.querySelector('.aspect-square img') as HTMLImageElement;
              if (img?.requestFullscreen) {
                img.requestFullscreen();
              }
            }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="mt-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded border-2 transition-all",
                  selectedIndex === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <img
                  src={item.thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
