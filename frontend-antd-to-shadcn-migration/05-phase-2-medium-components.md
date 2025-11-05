# Phase 2: Medium Complexity Component Replacements

## Overview
In this phase, we'll replace components with moderate complexity that often involve state management, form handling, or data display patterns.

## Components to Replace
1. **Modal** → Dialog
2. **Form** → shadcn/ui Form with react-hook-form
3. **Select** → shadcn/ui Select
4. **Tabs** → shadcn/ui Tabs
5. **Separator** → shadcn/ui Divider
6. **Checkbox/Radio** → shadcn/ui Checkbox/RadioGroup

## Step 1: Modal → Dialog Migration

### Files to Update:
- `/src/components/Profile/components/AddressBookModal.tsx`

### Migration Pattern:

**Before (Ant Design Modal):**
```tsx
import { Modal, Button } from "antd";

<Modal
  title="Address Information"
  open={visible}
  onCancel={onClose}
  width={600}
  footer={[
    <Button key="cancel" onClick={onClose}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleSubmit}>
      Save
    </Button>,
  ]}
>
  <ModalContent />
</Modal>
```

**After (shadcn/ui Dialog):**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog open={visible} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Address Information</DialogTitle>
      <DialogDescription>
        Add or update your delivery address
      </DialogDescription>
    </DialogHeader>
    <ModalContent />
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" onClick={handleSubmit}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Complete `/src/components/Profile/components/AddressBookModal.tsx`:

```tsx
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  isDefault: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface AddressBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

export default function AddressBookModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: AddressBookModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your delivery address
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Address</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Step 2: Tabs Component Migration

### Files to Update:
- `/src/components/Profile/ProfileSection.tsx`

### Migration Pattern:

**Before (Ant Design Tabs):**
```tsx
import { Tabs } from "antd";

const items = [
  {
    key: '1',
    label: 'Profile Information',
    children: <ProfileInfo />,
  },
  {
    key: '2',
    label: 'Address Book',
    children: <AddressBook />,
  },
];

<Tabs defaultActiveKey="1" items={items} />
```

**After (shadcn/ui Tabs):**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="profile" className="w-full">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="profile">Profile Information</TabsTrigger>
    <TabsTrigger value="address">Address Book</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    <ProfileInfo />
  </TabsContent>
  <TabsContent value="address">
    <AddressBook />
  </TabsContent>
</Tabs>
```

### Complete `/src/components/Profile/ProfileSection.tsx`:

```tsx
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile } from "../../services/userService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PasswordChange from "./PasswordChange";
import AddressBook from "./AddressBook";
import { useUserStore } from "../../stores";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user: userData, updateUserProfile } = useUserStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      address: userData?.address || "",
    },
  });

  useEffect(() => {
    if (userData) {
      setImagePreview(userData.avatar);
      form.reset({
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      });
    }
  }, [userData, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      await updateProfile(userData?.userId, formData);
      updateUserProfile({
        ...userData,
        ...data,
        avatar: imagePreview || userData.avatar,
      });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 pb-6 border-b">
        <Avatar className="h-20 w-20">
          <AvatarImage src={imagePreview || ""} alt={userData?.fullName} />
          <AvatarFallback className="text-lg">
            {userData?.fullName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userData?.fullName}</h1>
          <p className="text-muted-foreground">{userData?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      {...form.register("fullName")}
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your phone number"
                      {...form.register("phoneNumber")}
                    />
                    {form.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      {...form.register("address")}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="address">
          <AddressBook />
        </TabsContent>
        
        <TabsContent value="security">
          <PasswordChange />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Step 3: Additional Components

### Separator Replacement

**Before:**
```tsx
import { Divider } from 'antd';

<Divider />
```

**After:**
```tsx
import { Separator } from '@/components/ui/separator';

<Separator />
```

### Radio Group Replacement

**Before:**
```tsx
import { Radio } from 'antd';

<Radio.Group onChange={onChange} value={value}>
  <Radio value="a">Option A</Radio>
  <Radio value="b">Option B</Radio>
</Radio.Group>
```

**After:**
```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

<RadioGroup value={value} onValueChange={onChange}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="a" id="a" />
    <Label htmlFor="a">Option A</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="b" id="b" />
    <Label htmlFor="b">Option B</Label>
  </div>
</RadioGroup>
```

## Step 4: Create Custom Components for Missing Features

### Loading Spinner Component
Create `/src/components/ui/loading-spinner.tsx`:

```tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
```

### Alert/Message Component
Create `/src/components/ui/alert-message.tsx`:

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertMessageProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  className?: string;
}

const icons = {
  success: <CheckCircle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

const variants = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export function AlertMessage({ type, title, message, className }: AlertMessageProps) {
  return (
    <Alert className={cn(variants[type], className)}>
      {icons[type]}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
```

## Step 5: Test Component Integration

Create `/src/components/test-medium-components.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertMessage } from '@/components/ui/alert-message';

export default function TestMediumComponents() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog Test</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a sample dialog description.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Dialog content goes here.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tabs Test</h2>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 border rounded-lg">
              Content for Tab 1
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 border rounded-lg">
              Content for Tab 2
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 border rounded-lg">
              Content for Tab 3
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Radio Group Test</h2>
        <RadioGroup value={radioValue} onValueChange={setRadioValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <Label htmlFor="option1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <Label htmlFor="option2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="option3" />
            <Label htmlFor="option3">Option 3</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Selected: {radioValue}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Spinner Test</h2>
        <div className="flex items-center space-x-4">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Messages Test</h2>
        <div className="space-y-2">
          <AlertMessage type="success" message="Operation completed successfully!" />
          <AlertMessage type="error" title="Error" message="Something went wrong. Please try again." />
          <AlertMessage type="warning" message="Please review your input." />
          <AlertMessage type="info" message="Here's some helpful information." />
        </div>
      </div>
    </div>
  );
}
```

## Verification Checklist

### After Each Component Replacement:
- [ ] Component renders without errors
- [ ] Form validation works correctly
- [ ] Dialog opens/closes properly
- [ ] Tabs navigation works
- [ ] Radio group updates state
- [ ] No TypeScript errors
- [ ] Responsive behavior is maintained

### After Completing Phase 2:
- [ ] All Modal components replaced with Dialog
- [ ] All Forms use shadcn/ui Form with react-hook-form
- [ ] All Tabs components migrated
- [ ] Custom components (LoadingSpinner, AlertMessage) working
- [ ] Test component renders all examples correctly
- [ ] No antd Modal/Form/Tabs imports remain
- [ ] Ready to proceed to Phase 3

## Common Issues and Solutions

### Issue: Form not submitting
**Solution**: Ensure form is wrapped with `<form onSubmit={form.handleSubmit(onSubmit)}>`

### Issue: Dialog not closing on outside click
**Solution**: Dialog automatically handles this with `onOpenChange` prop

### Issue: Tabs content not switching
**Solution**: Ensure `TabsContent` values match `TabsTrigger` values

### Issue: Form validation not triggering
**Solution**: Make sure zod schema resolver is properly configured

## What's Next?
After completing Phase 2:
1. Test all form submissions and validations
2. Verify modal/dialog interactions
3. Proceed to `06-phase-3-complex-components.md` for Table and other complex components
4. Continue with checkout page migrations
