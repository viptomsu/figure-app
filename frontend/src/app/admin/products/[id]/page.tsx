'use client';

import { useEffect, useState } from 'react';
import { ProductForm } from '@/components/Admin/Product/ProductForm';
import { getProductById } from '@/services/client/productService';
import { Product } from '@/services/types';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = params.id as string;
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update product information.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
