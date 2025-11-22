import React from 'react';
import Countdown from './Countdown';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard/ProductCard';
import CustomCarousel from '@/components/Other/CustomCarousel';
import { getFilteredProductsServer } from '@/services/server';

async function DealOfTheDay() {
  const productsData = await getFilteredProductsServer(false, false, true);
  const products = productsData.content;

  if (products.length === 0) {
    return <div>Không có sản phẩm nào</div>;
  }

  return (
    <section id="deal-of-the-day" className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h4 className="text-2xl font-semibold mr-4">Ưu đãi trong ngày</h4>
            <Countdown />
          </div>
          <Link href="/shop" className="text-primary hover:text-red-700 transition-colors">
            Xem tất cả
          </Link>
        </div>
        <CustomCarousel>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CustomCarousel>
      </div>
    </section>
  );
}

export default DealOfTheDay;
