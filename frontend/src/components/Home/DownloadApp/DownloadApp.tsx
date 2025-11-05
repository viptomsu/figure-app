import React from "react";
import SubscribeForm from "../../Other/SubscribeForm";
import Link from "next/link";
import { ISmallImages } from "@/types/types";

const DownloadApp: React.FC = () => {
  const SmallImages: ISmallImages[] = [
    { id: 1, img: "/martfury-app/google-play.png" },
    { id: 2, img: "/martfury-app/app-store.png" },
  ];

  return (
    <section id="download-app" className="bg-orange-50">
      <div className="container">
        <div className="bg-orange-50 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            {/* App Image */}
            <div className="lg:pl-30">
              <div className="flex justify-center lg:justify-start">
                <img
                  src="/martfury-app/app-img.png"
                  alt="app"
                  className="w-auto h-auto"
                />
              </div>
            </div>

            {/* Download App Content */}
            <div className="lg:pr-[230px] flex items-center">
              <div className="w-full">
                <div className="text-left mb-8">
                  <h3 className="text-3xl font-light text-gray-900 mb-3">
                    Download Martfury App Now!
                  </h3>
                  <p className="text-gray-600 mb-7.5">
                    Shopping fastly and easily more with our app. Get a link to
                    download the app on your phone
                  </p>
                </div>

                <div className="mb-7.5">
                  <SubscribeForm />
                </div>

                <div className="flex gap-5">
                  {SmallImages.map((item) => (
                    <div key={item.id} className="flex-shrink-0">
                      <Link href="#/">
                        <img
                          src={item.img}
                          alt="img"
                          className="h-12 w-auto object-contain hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
