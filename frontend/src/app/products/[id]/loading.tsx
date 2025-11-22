import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProductDetailsLoading() {
  return (
    <div className="product-details-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-64" />
          </div>
        </section>

        {/* Product Details Skeleton */}
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 animate-pulse rounded" />
            {/* Info skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-12 bg-gray-200 animate-pulse rounded w-1/3" />
            </div>
          </div>
        </section>

        {/* Related Products Skeleton */}
        <section className="container py-8">
          <div className="text-center mb-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mx-auto" />
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </section>
      </div>
    </div>
  );
}