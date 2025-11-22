import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../../stores';

interface ChatBoxProps {
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [msgList, setMsgList] = useState<any[]>([]);
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const isGuest = !user || !user?.id;

    const senderInfo = isGuest
      ? {
          id: 'guest',
          username: 'guest',
          fullName: 'Khách',
          avatar: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png', // icon người dùng mặc định
          userId: 'guest',
        }
      : {
          id: user?.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
          userId: user?.id,
        };

    const userMessage = {
      content: inputMessage,
      sender: senderInfo,
      timestamp: new Date().toISOString(),
    };

    setMsgList((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputMessage }],
          max_tokens: 800,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        }
      );

      const aiMessage = aiResponse.data.choices[0].message.content;
      const botMessage = {
        content: aiMessage,
        sender: {
          id: 'AI',
          username: 'ChatGPT',
          fullName: 'ChatBot AI',
          avatar: 'https://i.pinimg.com/originals/21/a1/aa/21a1aa2537400d0232efd93e108fd953.gif',
          userId: 'AI',
        },
        timestamp: new Date().toISOString(),
      };

      setMsgList((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
    }

    setInputMessage('');
  };

  const parseMarkdownToHTML = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\n- (.*?)/g, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="fixed bottom-5 right-5 w-[550px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col z-1000">
      <div className="p-2.5 bg-[#0060c9] text-white flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://i.pinimg.com/originals/21/a1/aa/21a1aa2537400d0232efd93e108fd953.gif"
            alt="User Avatar"
            className="rounded-full mr-2.5 w-10 h-10"
          />
          <span>ChatBot AI</span>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-white">
          X
        </Button>
      </div>
      <div className="flex-1 p-2.5 overflow-y-auto">
        {msgList.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2.5 items-start justify-${
              msg.sender?.id === user?.id ? 'end' : 'start'
            }`}
          >
            {msg.sender?.id !== user?.id && (
              <img
                src={msg.sender.avatar}
                alt="Avatar"
                className="rounded-full w-7.5 h-7.5 mr-2.5"
              />
            )}
            <div
              className={`p-2.5 rounded-xl max-w-[60%] wrap-break-word ${
                msg.sender?.id === user?.id ? 'bg-[#f8c2c4]' : 'bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5 font-bold text-sm">
                <span className="text-gray-800">{msg.sender.fullName} - </span>
                <span className="text-xs text-gray-500">
                  {' '}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <div className="text-sm text-gray-800">
                {msg.sender?.id === 'AI' ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdownToHTML(msg.content),
                    }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="p-5 flex items-center">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Đặt câu hỏi"
          className="flex-1 mr-2.5 h-10 rounded-[20px]"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button
          variant="default"
          className="bg-[#0060c9] text-white rounded-full w-10 h-10"
          onClick={handleSendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
