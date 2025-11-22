'use client';

import React from 'react';
import ProductItem from './ProductItem';
import Link from 'next/link';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCompareStore } from '../../stores';
import { CompareItem } from '@/stores/compareStore';

const CompareSection = () => {
  const { compare } = useCompareStore();

  return (
    <section id="compare" className="py-20">
      <div className="container">
        <div className="flex justify-center mb-10">
          <h1>Sản phẩm quan tâm</h1>
        </div>
        {compare.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {compare.map((product: CompareItem, index: number) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductItem product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Danh sách phần quan tâm hiện đang trống.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary hover:text-red-700"
            >
              <HiArrowNarrowLeft size={20} />
              <span>Quay lại</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompareSection;
