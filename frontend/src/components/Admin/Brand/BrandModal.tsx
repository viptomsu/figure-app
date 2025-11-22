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
import { Brand } from '@/services/types';
import { createBrand, updateBrand } from '@/services/client/brandService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const brandSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  description: z.string().optional(),
  image: z.any().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: Brand | null;
  onSuccess: () => void;
}

export function BrandModal({ isOpen, onClose, brand, onSuccess }: BrandModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (brand) {
      reset({
        brandName: brand.brandName,
        description: brand.description || '',
      });
    } else {
      reset({
        brandName: '',
        description: '',
      });
    }
  }, [brand, reset, isOpen]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      if (brand) {
        await updateBrand(brand.id, data.brandName, data.description || '', data.image?.[0]);
        toast.success('Brand updated successfully');
      } else {
        await createBrand(data.brandName, data.description || '', data.image?.[0]);
        toast.success('Brand created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save brand');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{brand ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Name</label>
            <Input {...register('brandName')} placeholder="Enter brand name" />
            {errors.brandName && <p className="text-sm text-red-500">{errors.brandName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input {...register('description')} placeholder="Enter description" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <Input type="file" {...register('image')} accept="image/*" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {brand ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
