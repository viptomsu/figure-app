import React from 'react';
import ProductCard from '../../../ProductCard/ProductCard';
import SectionHeader from '../../Other/SectionHeader';
import CustomCarousel from '../../../Other/CustomCarousel';

interface ConsumerElectronicsProps {
  title: string;
  products: any[];
}

function ConsumerElectronics({ title, products }: ConsumerElectronicsProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <SectionHeader title={title} />
      </div>
      <div>
        <CustomCarousel>
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div>Không có sản phẩm nào</div>
          )}
        </CustomCarousel>
      </div>
    </div>
  );
}

export default ConsumerElectronics;
