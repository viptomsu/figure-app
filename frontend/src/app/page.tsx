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
      <div className="main">
        <Banner />
        <Advantages />
        <Suspense fallback={<DealOfTheDayFallback />}>
          <DealOfTheDay />
        </Suspense>
        <HomeAds1 />
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
        <HomeAds2 />
        <ChatButton />
      </div>
    </div>
  );
}

