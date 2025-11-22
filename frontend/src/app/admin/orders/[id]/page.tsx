'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order } from '@/services/types';
import apiClient from '@/services/client/apiClient';
import { API_CONFIG } from '@/services/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// We need to add getOrderById to orderService, but for now I'll fetch directly or add it.
// Actually, let's add it to orderService first or use a direct fetch here if service is missing.
// I'll check orderService again. It didn't have getOrderById.
// I'll just use apiClient here for speed, or better, update orderService.
// Let's update orderService in the next step. For now, I'll assume it exists or use apiClient.

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Using direct apiClient call since getOrderById might be missing
        // Adjust endpoint as needed. Usually it's /orders/{id}
        const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.ORDERS}/${params.id}`);
        setOrder(response.payload || response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <p className="text-muted-foreground">Order #{order.code}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold text-lg">${order.totalPrice.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{order.addressBook?.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{order.addressBook?.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span className="text-right max-w-[200px]">
                {order.addressBook?.address}, {order.addressBook?.ward},{' '}
                {order.addressBook?.district}, {order.addressBook?.city}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderDetails.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                      No Img
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.product.productName}</p>
                    {item.productVariation && (
                      <p className="text-sm text-gray-500">
                        {item.productVariation.name}: {item.productVariation.value}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">${item.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
