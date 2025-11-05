# Icon Migration: @ant-design/icons → lucide-react

## Overview
In this phase, we'll replace all @ant-design/icons with lucide-react icons. Lucide-react provides a comprehensive icon set with consistent styling and better TypeScript support.

## Why lucide-react?
- Modern, clean icon design
- Consistent stroke width and styling
- Better TypeScript support
- Tree-shakable - only bundle what you use
- Compatible with shadcn/ui design system
- Active development and maintenance

## Icon Mapping

| Ant Design Icon | Lucide Icon | Component Usage | Notes |
|-----------------|-------------|-----------------|-------|
| MessageOutlined | MessageCircle | Chat button | Similar appearance |
| SendOutlined | Send | Chat send button | Exact match |
| EditOutlined | Edit | Edit actions | Standard edit icon |
| DeleteOutlined | Trash2 | Delete actions | Trash with two lines |
| PlusOutlined | Plus | Add actions | Standard plus icon |
| CloseOutlined | X | Close actions | Simple X icon |
| CheckOutlined | Check | Success states | Simple checkmark |
| WarningOutlined | AlertTriangle | Warning states | Triangle warning icon |
| InfoCircleOutlined | Info | Info states | Circle with 'i' |
| UserOutlined | User | User avatars | Default user icon |
| ShoppingCartOutlined | ShoppingCart | Shopping cart | Standard cart icon |
| SearchOutlined | Search | Search inputs | Magnifying glass |
| SettingOutlined | Settings | Settings pages | Gear icon |
| HomeOutlined | Home | Navigation | House icon |

## Files to Update

1. `/src/app/page.tsx` - MessageOutlined → MessageCircle
2. `/src/components/Home/Chat/ChatBox.tsx` - SendOutlined → Send
3. `/src/components/Profile/AddressBook.tsx` - EditOutlined, DeleteOutlined → Edit, Trash2

## Step-by-Step Migration

### Step 1: Install lucide-react
```bash
npm install lucide-react
```

### Step 2: Update Import Statements

#### `/src/app/page.tsx`:
**Before:**
```tsx
import { MessageOutlined } from '@ant-design/icons';

<Button
  icon={<MessageOutlined size={25} />}
  onClick={toggleChatBox}
/>
```

**After:**
```tsx
import { MessageCircle } from 'lucide-react';

<Button onClick={toggleChatBox}>
  <MessageCircle className="h-6 w-6" />
</Button>
```

#### `/src/components/Home/Chat/ChatBox.tsx`:
**Before:**
```tsx
import { SendOutlined } from "@ant-design/icons";

<Button
  type="primary"
  icon={<SendOutlined />}
  onClick={handleSendMessage}
>
  Send
</Button>
```

**After:**
```tsx
import { Send } from "lucide-react";

<Button onClick={handleSendMessage}>
  <Send className="h-4 w-4" />
</Button>
```

#### `/src/components/Profile/AddressBook.tsx`:
**Before:**
```tsx
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

<Button icon={<EditOutlined />}>Edit</Button>
<Button icon={<DeleteOutlined />}>Delete</Button>
```

**After:**
```tsx
import { Edit, Trash2 } from "lucide-react";

<Button>
  <Edit className="h-4 w-4 mr-2" />
  Edit
</Button>
<Button variant="destructive">
  <Trash2 className="h-4 w-4 mr-2" />
  Delete
</Button>
```

### Step 3: Icon Sizing and Styling

Lucide-react icons use `w-` and `h-` Tailwind classes for sizing instead of `size` prop.

**Sizing Guide:**
- Ant Design `size={12}` → Lucide `className="w-12 h-12"`
- Ant Design `size={16}` → Lucide `className="w-16 h-16"`
- Ant Design `size={20}` → Lucide `className="w-20 h-20"`
- Ant Design `size={24}` → Lucide `className="w-24 h-24"`

**Common Sizes:**
```tsx
// Extra Small
<Icon className="w-3 h-3" />

// Small
<Icon className="w-4 h-4" />

// Medium
<Icon className="w-5 h-5" />

// Large
<Icon className="w-6 h-6" />

// Extra Large
<Icon className="w-8 h-8" />
```

### Step 4: Icon Variants and Colors

Lucide-react icons inherit color from their parent or can be styled with Tailwind classes.

**Color Examples:**
```tsx
// Primary color
<Icon className="w-5 h-5 text-primary" />

// Muted color
<Icon className="w-5 h-5 text-muted-foreground" />

// Destructive color
<Icon className="w-5 h-5 text-destructive" />

// Custom colors
<Icon className="w-5 h-5 text-blue-500" />
```

**Hover Effects:**
```tsx
<Icon className="w-5 h-5 transition-colors hover:text-primary" />
```

### Step 5: Create Icon Component Helpers

Create `/src/components/ui/icon.tsx`:

```tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export function Icon({ icon: IconComponent, size = "md", className, color }: IconProps) {
  return (
    <IconComponent
      className={cn(
        sizeClasses[size],
        color,
        className
      )}
    />
  );
}

// Usage examples
export function EditIcon(props: Omit<IconProps, "icon">) {
  return <Icon icon={Edit} {...props} />;
}

export function DeleteIcon(props: Omit<IconProps, "icon">) {
  return <Icon icon={Trash2} {...props} />;
}

export function MessageIcon(props: Omit<IconProps, "icon">) {
  return <Icon icon={MessageCircle} {...props} />;
}
```

### Step 6: Common Icon Patterns

**Button with Icon:**
```tsx
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";

// Icon before text
<Button>
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>

// Icon after text
<Button>
  Submit
  <Plus className="w-4 h-4 ml-2" />
</Button>

// Icon only button
<Button size="icon">
  <Edit className="w-4 h-4" />
</Button>
```

**Icon Button with Variants:**
```tsx
// Primary action
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add New
</Button>

// Secondary action
<Button variant="outline">
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>

// Destructive action
<Button variant="destructive">
  <Trash2 className="w-4 h-4 mr-2" />
  Delete
</Button>
```

**Status Icons:**
```tsx
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Success
<Badge variant="default" className="bg-green-100 text-green-800">
  <CheckCircle className="w-3 h-3 mr-1" />
  Complete
</Badge>

// Error
<Badge variant="destructive">
  <XCircle className="w-3 h-3 mr-1" />
  Failed
</Badge>

// Warning
<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
  <AlertTriangle className="w-3 h-3 mr-1" />
  Pending
</Badge>
```

### Step 7: Animated Icons

Lucide-react icons can be animated with Tailwind CSS classes:

```tsx
// Spinning icon
<Icon className="w-5 h-5 animate-spin" />

// Bounce icon
<Icon className="w-5 h-5 animate-bounce" />

// Pulse icon
<Icon className="w-5 h-5 animate-pulse" />

// Custom hover animation
<Icon className="w-5 h-5 transition-transform hover:scale-110" />
```

### Step 8: Complete File Updates

#### Update `/src/components/Profile/AddressBook.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, MapPin, Phone, User } from 'lucide-react';
import AddressBookModal from './components/AddressBookModal';
import { useUserStore } from '@/stores';
import { getAddressBooksByUserId, deleteAddressBook } from '@/services/addressBookService';

export default function AddressBook() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const { user } = useUserStore();

  const fetchAddresses = async () => {
    if (user?.userId) {
      try {
        const data = await getAddressBooksByUserId(user.userId);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddressBook(addressId);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressSubmit = () => {
    fetchAddresses();
    handleModalClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Address Book</h2>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
            <p className="text-muted-foreground mb-4">Add your first shipping address</p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <Card key={address._id} className={address.isDefault ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{address.name}</CardTitle>
                  {address.isDefault && (
                    <Badge variant="default" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <CardDescription>{address.phone}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>
                      {address.address}<br />
                      {address.city}, {address.state} {address.postalCode}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress 
                ? 'Update your shipping address details'
                : 'Enter your shipping address details'
              }
            </DialogDescription>
          </DialogHeader>
          <AddressBookModal
            initialData={editingAddress}
            onSubmit={handleAddressSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### Step 9: Search for Remaining Ant Design Icons

Search for any remaining @ant-design/icons imports:

```bash
grep -r "@ant-design/icons" src/
```

Or use VS Code search to find all occurrences.

### Step 10: Test All Icons

Create `/src/components/test-icons.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Send,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  User,
  ShoppingCart,
  Search,
  Settings,
  Home,
  MapPin,
  Phone,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Upload,
  Filter,
  Bell,
  Menu,
} from 'lucide-react';

export default function TestIcons() {
  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Sizes</h2>
        <div className="flex items-center space-x-4">
          <MessageCircle className={iconSizes.xs} />
          <MessageCircle className={iconSizes.sm} />
          <MessageCircle className={iconSizes.md} />
          <MessageCircle className={iconSizes.lg} />
          <MessageCircle className={iconSizes.xl} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Icons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Colors</h2>
        <div className="flex items-center space-x-4">
          <Check className="w-6 h-6 text-green-500" />
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <X className="w-6 h-6 text-red-500" />
          <Info className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Status Icons with Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Success
          </Badge>
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Error
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Common UI Icons</h2>
        <div className="grid grid-cols-6 gap-4">
          <div className="flex flex-col items-center space-y-2">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <User className="w-6 h-6" />
            <span className="text-xs">User</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs">Cart</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Bell className="w-6 h-6" />
            <span className="text-xs">Bell</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Animated Icons</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Spinner</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            <span>Pulse</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500 animate-bounce" />
            <span>Bounce</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Verification Checklist

### After Icon Migration:
- [ ] All @ant-design/icons imports replaced with lucide-react
- [ ] All icons properly sized with w- and h- classes
- [ ] Icon colors match the new theme
- [ ] Hover and interactive states work correctly
- [ ] No TypeScript errors related to icons
- [ ] All button icons display correctly
- [ ] Status icons show appropriate colors
- [ ] Icons are responsive and scale properly

## Common Issues and Solutions

### Issue: Icon not appearing
**Solution**: Ensure lucide-react is installed and icon is imported correctly

### Issue: Icon size is wrong
**Solution**: Use w- and h- Tailwind classes instead of size prop

### Issue: Icon color not changing
**Solution**: Use text-* classes or ensure parent element has appropriate color

### Issue: Icon alignment in button
**Solution**: Add mr-2 or ml-2 classes for proper spacing

### Issue: Animated icons not working
**Solution**: Use Tailwind animation classes or CSS animations

## What's Next?
After completing icon migration:
1. Verify all icons render correctly
2. Check responsive behavior on different screen sizes
3. Proceed to `08-cleanup-and-testing.md` for final cleanup
4. Remove @ant-design/icons from dependencies
