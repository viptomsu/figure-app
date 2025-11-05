'use client';

import HomeAds1 from '@/components/Home/Ads/HomeAds1';
import HomeAds2 from '@/components/Home/Ads/HomeAds2';
import Advantages from '@/components/Home/Advantages/Advantages';
import Banner from '@/components/Home/Banner/Banner';
import Categories from '@/components/Home/Categories/Categories';
import ChatBox from '@/components/Home/Chat/ChatBox';
import DealOfTheDay from '@/components/Home/DealOfTheDay/DealOfTheDay';
import { MessageOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function HomePage() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const toggleChatBox = async () => {
    setShowChatBox(!showChatBox);
  };

  const closeChatBox = () => {
    setShowChatBox(false);
  };

  return (
    <div className="home-content">
      <div className="main">
        <Banner />
        <Advantages />
        <DealOfTheDay />
        <HomeAds1 />
        <Categories />
        <HomeAds2 />
        <Button
          variant="default"
          size="icon-lg"
          className="fixed bottom-[50px] right-[90px] z-[1000] shadow-lg bg-[#0060c9] text-white w-[50px] h-[50px]"
          onClick={toggleChatBox}
        >
          <MessageOutlined />
        </Button>
        {showChatBox && <ChatBox onClose={closeChatBox} />}
      </div>
    </div>
  );
}

