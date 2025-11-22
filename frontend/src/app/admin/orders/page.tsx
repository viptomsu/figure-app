'use client';

import { useState, useEffect, useCallback } from 'react';
import { OrderTable } from '@/components/Admin/Order/OrderTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getAllOrders } from '@/services/client/orderService';
import { Order } from '@/services/types';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllOrders(1, 100, searchTerm);
      const data = response.payload?.content || response.data?.content || [];
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <OrderTable orders={orders} isLoading={isLoading} onStatusChange={fetchOrders} />
    </div>
  );
}
