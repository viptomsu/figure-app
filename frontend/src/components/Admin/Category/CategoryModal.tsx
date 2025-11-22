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
import { Category } from '@/services/types';
import { createCategory, updateCategory } from '@/services/client/categoryService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      description: '',
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        categoryName: category.categoryName,
        description: category.description || '',
      });
    } else {
      reset({
        categoryName: '',
        description: '',
      });
    }
  }, [category, reset, isOpen]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        await updateCategory(category.id, data.categoryName, data.description, data.image?.[0]);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data.categoryName, data.description, data.image?.[0]);
        toast.success('Category created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save category');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input {...register('categoryName')} placeholder="Enter category name" />
            {errors.categoryName && (
              <p className="text-sm text-red-500">{errors.categoryName.message}</p>
            )}
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
              {category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
