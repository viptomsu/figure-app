'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product, Category, Brand } from '@/services/types';
import { createProduct, updateProduct } from '@/services/client/productService';
import { getAllCategories } from '@/services/client/categoryService';
import { getAllBrands } from '@/services/client/brandService';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discount: z.coerce.number().min(0).max(100).optional(),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  isNewProduct: z.boolean().optional(),
  isSale: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ imageUrl: string; isDefault: boolean }[]>(
    []
  );
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: '',
      description: '',
      price: 0,
      discount: 0,
      stock: 0,
      categoryId: '',
      brandId: '',
      isNewProduct: false,
      isSale: false,
      isSpecial: false,
    } as any,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          getAllCategories(1, 100),
          getAllBrands(1, 100),
        ]);
        setCategories(categoriesRes.content || categoriesRes.data || []);
        setBrands(brandsRes.content || brandsRes.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load categories or brands');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        productName: product.productName,
        description: product.description || '',
        price: product.price,
        discount: product.discount || 0,
        stock: product.stock,
        categoryId: product.categoryId,
        brandId: product.brandId,
        isNewProduct: product.isNewProduct || false,
        isSale: product.isSale || false,
        isSpecial: product.isSpecial || false,
      });
      if (product.images) {
        setExistingImages(product.images);
      }
    }
  }, [product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append('productName', data.productName);
      formData.append('description', data.description || '');
      formData.append('price', data.price.toString());
      formData.append('discount', (data.discount || 0).toString());
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId);
      formData.append('brandId', data.brandId);
      formData.append('isNewProduct', String(data.isNewProduct));
      formData.append('isSale', String(data.isSale));
      formData.append('isSpecial', String(data.isSpecial));

      images.forEach((image) => {
        formData.append('images', image);
      });

      if (product) {
        await updateProduct(product.id, formData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully');
      }
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    }
  };

  if (isLoadingData) {
    return <div>Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input {...register('productName')} placeholder="Enter product name" />
          {errors.productName && (
            <p className="text-sm text-red-500">{errors.productName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input type="number" {...register('price')} placeholder="0" />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Discount (%)</label>
          <Input type="number" {...register('discount')} placeholder="0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Input type="number" {...register('stock')} placeholder="0" />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            {...register('categoryId')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <select
            {...register('brandId')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brandName}
              </option>
            ))}
          </select>
          {errors.brandId && <p className="text-sm text-red-500">{errors.brandId.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register('description')}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter product description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images</label>
        <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="flex gap-4 mt-4 flex-wrap">
          {existingImages.map((img, index) => (
            <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
              <img src={img.imageUrl} alt="Product" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isNewProduct')} className="w-4 h-4" />
          <span className="text-sm">New Product</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isSale')} className="w-4 h-4" />
          <span className="text-sm">On Sale</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isSpecial')} className="w-4 h-4" />
          <span className="text-sm">Special</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
