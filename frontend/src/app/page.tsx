'use client'

import React, { useState, useEffect } from "react"
import { Button, message } from "antd"
import { MessageOutlined } from "@ant-design/icons"
import Banner from "@/components/Home/Banner/Banner"
import Advantages from "@/components/Home/Advantages/Advantages"
import DealOfTheDay from "@/components/Home/DealOfTheDay/DealOfTheDay"
import HomeAds1 from "@/components/Home/Ads/HomeAds1"
import Categories from "@/components/Home/Categories/Categories"
import HomeAds2 from "@/components/Home/Ads/HomeAds2"
import ChatBox from "@/components/Home/Chat/ChatBox"
import { createChatRoom } from "@/services/chatRoomService"

export default function HomePage() {
  const [showChatBox, setShowChatBox] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleChatBox = async () => {
    setShowChatBox(!showChatBox)
  }

  const closeChatBox = () => {
    setShowChatBox(false)
  }

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
          type="primary"
          shape="circle"
          icon={<MessageOutlined size={25} />}
          size="large"
          style={styles.chatButton}
          onClick={toggleChatBox}
        />
        {showChatBox && <ChatBox onClose={closeChatBox} />}
      </div>
    </div>
  )
}

const styles = {
  chatButton: {
    position: "fixed" as "fixed",
    bottom: "50px",
    right: "90px",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    color: "#ffffff",
    backgroundColor: "#0060c9",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}
