'use client';

import { ProductForm } from '@/components/Admin/Product/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground">Add a new product to your inventory.</p>
      </div>
      <ProductForm />
    </div>
  );
}
