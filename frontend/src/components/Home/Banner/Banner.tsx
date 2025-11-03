import React from "react";
import Slider from "./Slider";
import Link from "next/link";
import { IBannerRightDataTypes } from "@/types/types";

const Banner: React.FC = () => {
  const BannerRightData: IBannerRightDataTypes[] = [
    {
      id: 1,
      img: "/banner/banner-4.jpg",
    },
    {
      id: 2,
      img: "/banner/banner-5.jpg",
    },
  ];

  return (
    <section id="home-banner">
      <div className="container">
        <div className="home-banner-content">
          <div className="banner-slider-wrapper banner-left">
            <Slider />
          </div>
          <div className="banner-right-imgs">
            {BannerRightData.map((item) => (
              <div key={item.id} className="banner-img-wrapper">
                <Link href="/shop">
                  <img
                    src={item.img}
                    alt="banner-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
