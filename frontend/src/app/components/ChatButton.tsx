'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ChatBox from '@/components/Home/Chat/ChatBox';

export default function ChatButton() {
  const [showChatBox, setShowChatBox] = useState(false);

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  const closeChatBox = () => {
    setShowChatBox(false);
  };

  return (
    <>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-[50px] right-[90px] z-[1000] shadow-lg bg-[#0060c9] text-white w-[50px] h-[50px]"
        onClick={toggleChatBox}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {showChatBox && <ChatBox onClose={closeChatBox} />}
    </>
  );
}
