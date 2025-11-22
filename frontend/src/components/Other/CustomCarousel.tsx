"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CustomCarouselProps {
  children: React.ReactNode
  className?: string
  showDots?: boolean
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  className = "",
  showDots = true,
}) => {
  return (
    <div className={className}>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {React.Children.map(children, (child, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {showDots && (
        <div className="flex justify-center mt-4 space-x-2"></div>
      )}
    </div>
  );
};

export default CustomCarousel
