import HomeAds1 from '@/components/Home/Ads/HomeAds1';
import HomeAds2 from '@/components/Home/Ads/HomeAds2';
import Advantages from '@/components/Home/Advantages/Advantages';
import Banner from '@/components/Home/Banner/Banner';
import Categories from '@/components/Home/Categories/Categories';
import DealOfTheDay from '@/components/Home/DealOfTheDay/DealOfTheDay';
import ChatButton from './components/ChatButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

const DealOfTheDayFallback = () => (
  <section className="py-8">
    <div className="container">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Ưu đãi trong ngày</h2>
      </div>
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  </section>
);

const CategoriesFallback = () => (
  <section className="pb-15">
    <div className="container">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Danh mục sản phẩm</h2>
      </div>
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="home-content">
      <div className="main space-y-8 md:space-y-12 pb-12">
        <section className="animate-fade-in">
          <Banner />
        </section>

        <section className="animate-slide-up [animation-delay:200ms]">
          <Advantages />
        </section>

        <section className="animate-slide-up [animation-delay:400ms]">
          <Suspense fallback={<DealOfTheDayFallback />}>
            <DealOfTheDay />
          </Suspense>
        </section>

        <section className="animate-slide-up [animation-delay:600ms]">
          <HomeAds1 />
        </section>

        <section className="animate-slide-up [animation-delay:800ms]">
          <Suspense fallback={<CategoriesFallback />}>
            <Categories />
          </Suspense>
        </section>

        <section className="animate-slide-up [animation-delay:1000ms]">
          <HomeAds2 />
        </section>

        <div className="fixed bottom-6 right-6 z-40 animate-scale-in [animation-delay:1200ms]">
          <ChatButton />
        </div>
      </div>
    </div>
  );
}
