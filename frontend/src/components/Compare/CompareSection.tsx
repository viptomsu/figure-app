import React from "react";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCompareStore } from "../../stores";

const CompareSection: React.FC = () => {
  const { compare } = useCompareStore();

  return (
    <section id="compare">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* ======= tiêu đề ======= */}
            <div className="title text-center">
              <h1>Sản phẩm quan tâm</h1>
            </div>
          </div>
        </div>
        {compare.length > 0 ? (
          <>
            <div className="row">
              <div className="col-12">
                {/* ======= slider phần quan tâm ======= */}
                <div className="relative">
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {compare.map((product: any, index: number) => (
                        <CarouselItem 
                          key={index}
                          className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        >
                          <ProductItem product={product} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ======= thông báo khi danh sách trống ======= //
          <>
            <div className="empty-alert-wrapper">
              <p className="m-0">Danh sách phần quan tâm hiện đang trống.</p>
            </div>
            <div className="back-to-shop-link">
              <Link href="/shop" className="d-flex align-items-center">
                <span>
                  <HiArrowNarrowLeft color={"#ffffff"} />
                </span>
                <p style={{ color: "#ffffff" }} className="m-0">
                  Quay lại
                </p>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CompareSection;
