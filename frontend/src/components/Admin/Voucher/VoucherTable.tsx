'use client';

import { Voucher, changeVoucherStatus } from '@/services/client/voucherService';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface VoucherTableProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}

export function VoucherTable({
  vouchers,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}: VoucherTableProps) {
  const handleStatusToggle = async (id: string) => {
    try {
      await changeVoucherStatus(id);
      toast.success('Voucher status updated');
      onStatusChange();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount (%)</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                No vouchers found
              </TableCell>
            </TableRow>
          ) : (
            vouchers.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.discount}%</TableCell>
                <TableCell>{new Date(item.expirationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.isUsed}
                    onCheckedChange={() => handleStatusToggle(item.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
