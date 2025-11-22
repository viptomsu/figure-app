import React from 'react';
import Link from 'next/link';

const HomeAds2: React.FC = () => {
  return (
    <section id="ads-2" className="bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bed img */}
          <div className="lg:col-span-8 sm:mt-6">
            <Link href="/shop">
              <img
                src={'/banner/gundam-ads-wide.png'}
                alt="bed"
                className="w-[856px] h-[193px] object-cover sm:w-full sm:h-auto sm:max-w-[856px] sm:max-h-[193px]"
              />
            </Link>
          </div>
          {/* Iphone img */}
          <div className="lg:col-span-4 sm:mt-7">
            <Link href="/shop">
              <img
                src={'/banner/gundam-ads-small.png'}
                alt="iphonex"
                className="w-[416px] h-[193px] object-cover sm:w-full sm:h-auto sm:max-w-[416px] sm:max-h-[193px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAds2;
