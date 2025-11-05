# Phase 1: Simple Component Replacements

## Overview
In this phase, we'll replace the most commonly used and straightforward components. These are typically standalone components that don't have complex dependencies or state management.

## Components to Replace
1. **Button** - Used in 6+ files
2. **Input** - Form inputs
3. **Avatar** - User avatars
4. **Badge/Tag** - Status indicators

## Step 1: Button Component

### Files to Update:
- `/src/app/page.tsx`
- `/src/components/Checkout/ShippingInfo/ShippingInfo.tsx`
- `/src/components/Home/Chat/ChatBox.tsx`
- `/src/app/not-found.tsx`
- `/src/app/error.tsx`
- `/src/app/checkout/page.tsx`

### Migration Pattern:

#### `/src/app/page.tsx`
**Before:**
```tsx
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

<Button
  type="primary"
  shape="circle"
  icon={<MessageOutlined size={25} />}
  size="large"
  style={styles.chatButton}
  onClick={toggleChatBox}
/>
```

**After:**
```tsx
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

<Button
  size="icon"
  className="fixed bottom-12 right-20 z-50 h-12 w-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105"
  onClick={toggleChatBox}
>
  <MessageCircle className="h-6 w-6" />
</Button>
```

#### `/src/components/Checkout/ShippingInfo/ShippingInfo.tsx`
**Before:**
```tsx
import { Button } from "antd";

<Button type="primary" onClick={handleSave}>
  Save
</Button>
```

**After:**
```tsx
import { Button } from "@/components/ui/button";

<Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
  Save
</Button>
```

### Button Variants to Use:
- `default` - For primary actions
- `outline` - For secondary actions
- `ghost` - For subtle actions
- `destructive` - For delete/remove actions
- Custom gradient for special buttons (like chat button)

## Step 2: Input Component

### Files to Update:
- `/src/components/Home/Chat/ChatBox.tsx`
- `/src/components/Profile/components/AddressBookModal.tsx`

### Migration Pattern:

#### `/src/components/Home/Chat/ChatBox.tsx`
**Before:**
```tsx
import { Input } from "antd";

<Input
  placeholder="Type a message..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
```

**After:**
```tsx
import { Input } from "@/components/ui/input";

<Input
  placeholder="Type a message..."
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
  className="focus:ring-2 focus:ring-primary/20"
/>
```

#### `/src/components/Profile/components/AddressBookModal.tsx`
**Before:**
```tsx
import { Input } from "antd";

<Form.Item name="name" label="Name">
  <Input />
</Form.Item>
```

**After:**
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <Label htmlFor="name">Name</Label>
      <FormControl>
        <Input
          id="name"
          placeholder="Enter your name"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Step 3: Avatar Component

### Files to Update:
- `/src/components/History/HistorySection.tsx`
- `/src/components/Profile/AddressBook.tsx`

### Migration Pattern:

#### `/src/components/History/HistorySection.tsx`
**Before:**
```tsx
import { Avatar } from "antd";

<Avatar src={user.avatar} size="large">
  {user.name.charAt(0)}
</Avatar>
```

**After:**
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar className="h-10 w-10">
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback className="bg-primary text-primary-foreground">
    {user.name.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

### Avatar Styles to Implement:
- Different sizes: sm (32px), default (40px), lg (48px)
- Fallback with initials
- Gradient fallback backgrounds
- Border variants

## Step 4: Badge/Tag Component

### Files to Update:
- `/src/components/History/HistorySection.tsx`

### Migration Pattern:

#### `/src/components/History/HistorySection.tsx`
**Before:**
```tsx
import { Tag } from "antd";

<Tag color="green">Completed</Tag>
<Tag color="orange">Processing</Tag>
<Tag color="red">Cancelled</Tag>
```

**After:**
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
  Completed
</Badge>
<Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
  Processing
</Badge>
<Badge variant="destructive">
  Cancelled
</Badge>
```

### Badge Variants for Order Status:
- `default` - For default/normal status
- `secondary` - For warning/pending status
- `destructive` - For error/cancelled status
- `outline` - For subtle indicators

## Step 5: Complete File Migrations

### Update `/src/app/page.tsx` completely:

```tsx
'use client';

import HomeAds1 from '@/components/Home/Ads/HomeAds1';
import HomeAds2 from '@/components/Home/Ads/HomeAds2';
import Advantages from '@/components/Home/Advantages/Advantages';
import Banner from '@/components/Home/Banner/Banner';
import Categories from '@/components/Home/Categories/Categories';
import ChatBox from '@/components/Home/Chat/ChatBox';
import { MessageCircle } from 'lucide-react';
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
          size="icon"
          className="fixed bottom-12 right-20 z-50 h-12 w-12 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105"
          onClick={toggleChatBox}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {showChatBox && <ChatBox onClose={closeChatBox} />}
      </div>
    </div>
  );
}
```

### Update `/src/components/Home/Chat/ChatBox.tsx` completely:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. Our team will get back to you soon!',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <Card className="fixed bottom-24 right-4 w-96 h-[500px] shadow-2xl z-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Customer Support</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-60px)]">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Hi! How can we help you today?
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                    : 'bg-muted max-w-[80%]'
                }`}
              >
                {message.text}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Step 6: Test All Changes

### Create Test Component
Create `/src/components/test-simple-components.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestSimpleComponents() {
  return (
    <div className="space-y-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Button Tests</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Default input" />
          <Input placeholder="Input with error" className="border-red-500" />
          <Input placeholder="Disabled input" disabled />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badge Tests</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar Tests</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="h-12 w-12">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">AB</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Verification Checklist

### After Each File Update:
- [ ] Component renders without errors
- [ ] Styles match the new theme
- [ ] All props/variants work correctly
- [ ] Responsive behavior is maintained
- [ ] Dark mode compatibility (if implemented)
- [ ] No TypeScript errors
- [ ] No console warnings

### After Completing Phase 1:
- [ ] All 9 files updated successfully
- [ ] All buttons replaced and styled
- [ ] All inputs replaced and functional
- [ ] All avatars replaced with proper fallbacks
- [ ] All badges/tags replaced with appropriate variants
- [ ] Test component renders all examples correctly
- [ ] No antd imports remain in updated files
- [ ] Ready to proceed to Phase 2

## Common Issues and Solutions

### Issue: Button styles not applying
**Solution**: Ensure the button component is imported from `@/components/ui/button`

### Issue: Input focus styles missing
**Solution**: Add focus classes like `focus:ring-2 focus:ring-primary/20`

### Issue: Avatar not showing fallback
**Solution**: Ensure both AvatarImage and AvatarFallback components are used

### Issue: Badge colors not matching
**Solution**: Use custom className with Tailwind colors for specific status colors

## What's Next?
After completing Phase 1:
1. Test all changes thoroughly
2. Run the application and verify UI
3. Proceed to `05-phase-2-medium-components.md` for Form, Table, and Tabs replacements
4. Keep antd dependency until all components are migrated
