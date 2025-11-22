import Link from 'next/link';
import ProductDetailsContent from '@/components/ProductDetails/ProductDetailsContent';
import RelatedProducts from '@/components/ProductDetails/RelatedProducts/RelatedProducts';
import { getProductByIdServer } from '@/services/server';
import { notFound } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

const RelatedProductsFallback = () => (
  <section className="pb-15">
    <div className="container">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold">Sản phẩm liên quan</h3>
      </div>
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  </section>
);

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  try {
    const product = await getProductByIdServer(id);

    if (!product) {
      notFound();
    }

    return (
      <div className="product-details-content">
        <div className="main">
          <section id="breadcrumb">
            <div className="container">
              <ul className="breadcrumb-content d-flex m-0 p-0">
                <li>
                  <Link href="/">Trang chủ</Link>
                </li>
                <li>
                  <Link href="/shop">Cửa hàng</Link>
                </li>
                <li>
                  <span>Chi tiết sản phẩm</span>
                </li>
              </ul>
            </div>
          </section>

          <ProductDetailsContent theProduct={product} loading={false} />
          <Suspense fallback={<RelatedProductsFallback />}>
            <RelatedProducts product={product} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error: any) {
    // If 404 error, call notFound
    if (error?.status === 404) {
      notFound();
    }
    // Re-throw other errors to allow route error boundary to handle
    throw error;
  }
}
