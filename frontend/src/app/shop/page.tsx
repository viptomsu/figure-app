import Link from 'next/link';
import Shop from '@/components/Shop';
import { getAllProductsServer, getAllBrandsServer } from '@/services/server';
import { shopSearchParamsSchema } from '@/schema/searchParams';
import { parseSearchParams } from '@/utils/searchParamsParser';

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await parseSearchParams(searchParams, shopSearchParamsSchema);
  const { page, limit, sort, direction, categoryId } = params;

  const products = await getAllProductsServer('', categoryId, null, page, limit, sort, direction);
  const brandsData = await getAllBrandsServer(1, 1000);

  return (
    <div className="shop-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <span>Cửa hàng</span>
              </li>
            </ul>
          </div>
        </section>
        <Shop
          initialProducts={products.content || products.payload || []}
          initialPage={page}
          initialSort={sort}
          initialDirection={direction}
          initialCategory={categoryId}
          totalPages={products.totalPages}
          initialBrands={brandsData.content || []}
        />
      </div>
    </div>
  );
}
