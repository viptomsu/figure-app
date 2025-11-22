import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ShopLoading() {
  return (
    <div className="shop-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-48" />
          </div>
        </section>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-lg text-muted-foreground">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    </div>
  );
}