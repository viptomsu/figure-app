import React, { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ISliderDataTypes } from "../../../types/types";

const Slider: React.FC = () => {
  const SliderData: ISliderDataTypes[] = [
    {
      id: 1,
      img: "/banner/banner-1.png",
    },
    {
      id: 2,
      img: "/banner/banner-2.jpg",
    },
    {
      id: 3,
      img: "/banner/banner-3.png",
    },
  ];

  const [tabIndex, setTabIndex] = useState<number>(1);

  const handleRightBtnClick = (): void => {
    setTabIndex(tabIndex + 1);
    if (tabIndex >= 3) setTabIndex(1);
  };

  const handleLeftBtnClick = (): void => {
    setTabIndex(tabIndex - 1);
    if (tabIndex <= 1) setTabIndex(3);
  };

  return (
    <div className="banner-slider">
      {/* ======= Slide item ======= */}
      {SliderData.map((item) => (
        <div
          key={item.id}
          className={item.id === tabIndex ? "slide-item" : "d-none"}
        >
          <Link to="/shop">
            <img
              src={item.img}
              alt="slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Ensure image fills the container
              }}
            />
          </Link>
        </div>
      ))}
      {/* ======= Slider buttons ======= */}
      <div className="slider-btns">
        <button onClick={handleLeftBtnClick} className="left-btn">
          <FaChevronLeft size={60} color="#fff" />
        </button>
        <button onClick={handleRightBtnClick} className="right-btn">
          <FaChevronRight size={60} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
