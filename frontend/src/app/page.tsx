import HomeAds1 from '@/components/Home/Ads/HomeAds1';
import HomeAds2 from '@/components/Home/Ads/HomeAds2';
import Advantages from '@/components/Home/Advantages/Advantages';
import Banner from '@/components/Home/Banner/Banner';
import Categories from '@/components/Home/Categories/Categories';
import DealOfTheDay from '@/components/Home/DealOfTheDay/DealOfTheDay';
import ChatButton from './components/ChatButton';

export default function HomePage() {
  return (
    <div className="home-content">
      <div className="main">
        <Banner />
        <Advantages />
        <DealOfTheDay />
        <HomeAds1 />
        <Categories />
        <HomeAds2 />
        <ChatButton />
      </div>
    </div>
  );
}

