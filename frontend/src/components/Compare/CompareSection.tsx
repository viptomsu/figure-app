import React from "react";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import SwiperCore, { Navigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCompareStore } from "../../stores";

SwiperCore.use([Navigation, A11y]);

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
                <Swiper
                  slidesPerView={1}
                  navigation
                  breakpoints={{
                    "320": {
                      slidesPerView: 1,
                      spaceBetween: 0,
                    },
                    "576": {
                      slidesPerView: 2,
                      spaceBetween: 0,
                    },
                    "768": {
                      slidesPerView: 3,
                      spaceBetween: 0,
                    },
                    "992": {
                      slidesPerView: 3,
                      spaceBetween: 0,
                    },
                    "1200": {
                      slidesPerView: 4,
                      spaceBetween: 0,
                    },
                  }}
                >
                  <div className="compare-slider">
                    {compare.map((product: any, index: number) => (
                      <SwiperSlide key={index}>
                        <ProductItem product={product} />
                      </SwiperSlide>
                    ))}
                  </div>
                </Swiper>
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
