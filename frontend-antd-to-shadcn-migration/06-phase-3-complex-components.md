# Phase 3: Complex Component Replacements

## Overview
In this phase, we'll replace the most complex components that involve data display, complex layouts, and specialized functionality. These components require careful migration to maintain functionality.

## Components to Replace
1. **Table** - Data tables with sorting and pagination
2. **List** - Custom list implementations
3. **Steps** - Multi-step process indicators
4. **Result** - Success/Error page templates
5. **Typography** - Text styling components
6. **Layout Grid** - Row/Col system

## Step 1: Table Component Migration

### Files to Update:
- `/src/components/History/HistorySection.tsx`

### Migration Pattern:

**Before (Ant Design Table):**
```tsx
import { Table, Tag, Avatar } from "antd";

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'completed' ? 'green' : 'orange'}>
        {status}
      </Tag>
    ),
  },
];

<Table
  columns={columns}
  dataSource={orders}
  pagination={{
    current: pagination.page,
    total: pagination.totalElements,
    pageSize: pagination.limit,
    onChange: handlePageChange,
  }}
  loading={loading}
/>
```

**After (shadcn/ui Table):**
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Total</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {loading ? (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-8">
          <LoadingSpinner size="lg" className="mx-auto" />
        </TableCell>
      </TableRow>
    ) : orders.length === 0 ? (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
          No orders found
        </TableCell>
      </TableRow>
    ) : (
      orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell className="font-medium">#{order.id}</TableCell>
          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>
            <Badge
              variant={
                order.status === 'completed'
                  ? 'default'
                  : order.status === 'processing'
                  ? 'secondary'
                  : 'destructive'
              }
              className={
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'processing'
                  ? 'bg-orange-100 text-orange-800'
                  : ''
              }
            >
              {order.status}
            </Badge>
          </TableCell>
          <TableCell>${order.total}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewOrder(order)}
            >
              View
            </Button>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

### Complete Table with Pagination:
Create `/src/components/ui/pagination.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoForward}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

### Complete `/src/components/History/HistorySection.tsx`:

```tsx
'use client';

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useUserStore } from "../../stores";
import { getOrdersByUserId } from "../../services/orderService";

interface Order {
  id: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function HistorySection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    limit: 5,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useUserStore();

  const fetchUserOrders = async (currentPage = 1, limit = 5) => {
    if (user?.userId) {
      setLoading(true);
      try {
        const { content, page, totalPages, totalElements } =
          await getOrdersByUserId(user.userId, currentPage, limit);
        setOrders(content);
        setPagination({
          page,
          totalPages,
          totalElements,
          limit,
        });
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserOrders(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, user]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">
          View and track your order history
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <LoadingSpinner size="lg" className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusBadgeClass(order.status)}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}

      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedOrder.status)}
                    className={getStatusBadgeClass(selectedOrder.status)}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</p>
                <p className="text-sm">
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Step 2: Steps Component

### Files to Update:
- `/src/app/checkout/page.tsx`

### Create `/src/components/ui/steps.tsx`:

```tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
  status: "complete" | "active" | "inactive";
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  step.status === "complete"
                    ? "bg-primary text-primary-foreground"
                    : step.status === "active"
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "complete" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "active"
                      ? "text-foreground"
                      : step.status === "complete"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4 mt-5 transition-all duration-200",
                  step.status === "complete" ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Steps Usage in Checkout:

```tsx
import { Steps } from "@/components/ui/steps";

const checkoutSteps = [
  {
    id: "shipping",
    title: "Shipping",
    description: "Delivery address",
    status: currentStep === 0 ? "active" : currentStep > 0 ? "complete" : "inactive",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Payment method",
    status: currentStep === 1 ? "active" : currentStep > 1 ? "complete" : "inactive",
  },
  {
    id: "review",
    title: "Review",
    description: "Review order",
    status: currentStep === 2 ? "active" : currentStep > 2 ? "complete" : "inactive",
  },
];

<Steps steps={checkoutSteps} currentStep={currentStep} />
```

## Step 3: Result Component Templates

### Create `/src/components/ui/result.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Home,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultProps {
  status: "success" | "error" | "warning" | "info";
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  className?: string;
}

const icons = {
  success: <CheckCircle className="w-16 h-16 text-green-500" />,
  error: <XCircle className="w-16 h-16 text-red-500" />,
  warning: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
  info: <Info className="w-16 h-16 text-blue-500" />,
};

const bgColors = {
  success: "bg-green-50",
  error: "bg-red-50",
  warning: "bg-yellow-50",
  info: "bg-blue-50",
};

export function Result({ status, title, subtitle, extra, className }: ResultProps) {
  return (
    <Card className={cn("max-w-md mx-auto", bgColors[status], className)}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">{icons[status]}</div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-base">{subtitle}</CardDescription>
        )}
      </CardHeader>
      {extra && (
        <CardContent className="pt-0">
          <div className="flex justify-center">{extra}</div>
        </CardContent>
      )}
    </Card>
  );
}

// Pre-built result templates
export function NotFoundResult({ onGoHome }: { onGoHome: () => void }) {
  return (
    <Result
      status="error"
      title="404 - Page Not Found"
      subtitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={onGoHome} className="mt-4">
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      }
    />
  );
}

export function ServerErrorResult({ onRetry }: { onRetry: () => void }) {
  return (
    <Result
      status="error"
      title="500 - Server Error"
      subtitle="Something went wrong on our end. Please try again."
      extra={
        <div className="space-x-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      }
    />
  );
}

export function SuccessResult({ 
  title, 
  subtitle, 
  onContinue 
}: { 
  title: string;
  subtitle?: string;
  onContinue: () => void;
}) {
  return (
    <Result
      status="success"
      title={title}
      subtitle={subtitle}
      extra={
        <Button onClick={onContinue} className="mt-4">
          Continue
        </Button>
      }
    />
  );
}
```

### Update Error Pages:

#### `/src/app/not-found.tsx`:
```tsx
import { NotFoundResult } from "@/components/ui/result";
import Link from "next/link";

export default function NotFound() {
  const handleGoHome = () => {
    Link.push("/");
  };

  return <NotFoundResult onGoHome={handleGoHome} />;
}
```

#### `/src/app/error.tsx`:
```tsx
'use client';

import { ServerErrorResult } from "@/components/ui/result";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerErrorResult onRetry={reset} />;
}
```

## Step 4: Grid Layout Migration (Row/Col)

### Ant Design Grid to Tailwind CSS Grid:

```tsx
// Ant Design
<Row gutter={[16, 16]}>
  <Col span={24}>Full width</Col>
  <Col span={12}>Half width</Col>
  <Col span={12}>Half width</Col>
  <Col span={8}>Third width</Col>
  <Col span={8}>Third width</Col>
  <Col span={8}>Third width</Col>
  <Col xs={24} sm={12} md={8} lg={6}>Responsive</Col>
</Row>

// Tailwind CSS
<div className="grid grid-cols-1 gap-4">
  <div className="col-span-full">Full width</div>
  <div className="grid grid-cols-2 gap-4">
    <div>Half width</div>
    <div>Half width</div>
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div>Third width</div>
    <div>Third width</div>
    <div>Third width</div>
  </div>
  <div className="col-span-1 xs:col-span-2 sm:col-span-3 lg:col-span-4">Responsive</div>
</div>
```

### Update `/src/app/checkout/page.tsx` Grid Layouts:

**Before:**
```tsx
<Row gutter={[16, 16]}>
  <Col span={16}>
    <CartItems />
  </Col>
  <Col span={8}>
    <OrderSummary />
  </Col>
</Row>
```

**After:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    <CartItems />
  </div>
  <div className="lg:col-span-1">
    <OrderSummary />
  </div>
</div>
```

## Step 5: Complete Checkout Page Migration

### Create Checkout Components:

#### Create `/src/components/checkout/CartItems.tsx`:
```tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/stores";
import { formatCurrency } from "@/utils/currencyFormatter";

export function CartItems() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      
      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Step 6: Test Complex Components

Create `/src/components/test-complex-components.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Steps } from '@/components/ui/steps';
import { Pagination } from '@/components/ui/pagination';
import { Result, NotFoundResult } from '@/components/ui/result';

export default function TestComplexComponents() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const steps = [
    { id: '1', title: 'Step 1', status: currentStep === 0 ? 'active' : currentStep > 0 ? 'complete' : 'inactive' },
    { id: '2', title: 'Step 2', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'complete' : 'inactive' },
    { id: '3', title: 'Step 3', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'complete' : 'inactive' },
  ];

  const sampleData = [
    { id: 1, name: 'John Doe', status: 'Active', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', status: 'Inactive', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', status: 'Active', email: 'bob@example.com' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Table Test</h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Steps Test</h2>
        <Steps steps={steps} currentStep={currentStep} />
        <div className="flex space-x-2">
          <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
            Previous
          </Button>
          <Button onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}>
            Next
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pagination Test</h2>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Result Components Test</h2>
        <Result
          status="success"
          title="Operation Successful"
          subtitle="Your action has been completed successfully."
        />
      </div>
    </div>
  );
}
```

## Verification Checklist

### After Completing Phase 3:
- [ ] All Table components replaced with shadcn/ui Table
- [ ] Custom Pagination component working
- [ ] Steps component implemented for checkout flow
- [ ] Result templates created and working
- [ ] All Row/Col layouts converted to Tailwind Grid
- [ ] Test component renders all examples correctly
- [ ] No antd Table/Steps/Result/Row/Col imports remain
- [ ] Ready to proceed to icon migration

## Common Issues and Solutions

### Issue: Table not responsive
**Solution**: Wrap table in a div with `overflow-x-auto` class

### Issue: Steps indicator not updating
**Solution**: Ensure step status is recomputed when currentStep changes

### Issue: Pagination not working with data
**Solution**: Verify onPageChange properly updates the data fetching logic

### Issue: Grid layout breaking on mobile
**Solution**: Use responsive grid classes (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## What's Next?
After completing Phase 3:
1. Test all table functionality including sorting and filtering
2. Verify checkout flow works with new Steps component
3. Proceed to `07-icon-migration.md` for @ant-design/icons replacement
4. Complete final cleanup in `08-cleanup-and-testing.md`
