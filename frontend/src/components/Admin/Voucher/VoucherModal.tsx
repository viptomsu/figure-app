'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Voucher, createVoucher, updateVoucher } from '@/services/client/voucherService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const voucherSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discount: z.coerce.number().min(0).max(100, 'Discount must be between 0 and 100'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
});

type VoucherFormValues = z.infer<typeof voucherSchema>;

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  voucherToEdit?: Voucher | null;
}

export function VoucherModal({ isOpen, onClose, onSuccess, voucherToEdit }: VoucherModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: '',
      discount: 0,
      expirationDate: '',
    } as any,
  });

  useEffect(() => {
    if (isOpen) {
      if (voucherToEdit) {
        setValue('code', voucherToEdit.code);
        setValue('discount', voucherToEdit.discount);
        // Format date for input type="date"
        const date = new Date(voucherToEdit.expirationDate);
        const formattedDate = date.toISOString().split('T')[0];
        setValue('expirationDate', formattedDate);
      } else {
        reset({
          code: '',
          discount: 0,
          expirationDate: '',
        });
      }
    }
  }, [isOpen, voucherToEdit, reset, setValue]);

  const onSubmit = async (data: VoucherFormValues) => {
    try {
      if (voucherToEdit) {
        await updateVoucher(voucherToEdit.id, data);
        toast.success('Voucher updated successfully');
      } else {
        await createVoucher(data);
        toast.success('Voucher created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save voucher');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{voucherToEdit ? 'Edit Voucher' : 'Create Voucher'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" {...register('code')} placeholder="Enter voucher code" />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              {...register('discount')}
              placeholder="Enter discount percentage"
            />
            {errors.discount && <p className="text-sm text-red-500">{errors.discount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input id="expirationDate" type="date" {...register('expirationDate')} />
            {errors.expirationDate && (
              <p className="text-sm text-red-500">{errors.expirationDate.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {voucherToEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
