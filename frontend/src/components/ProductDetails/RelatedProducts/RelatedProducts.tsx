import { getAllProductsServer } from '@/services/server';
import CustomCarousel from '../../Other/CustomCarousel';
import ProductCard from '../../ProductCard/ProductCard';

import { Product } from '@/services/types';

async function RelatedProducts({ product }: { product: Product }) {
  const categoryId = product.categoryId;

  if (!categoryId) {
    return <p>Không có sản phẩm liên quan.</p>;
  }

  const response = await getAllProductsServer('', categoryId, null, 1, 10, 'productName', 'asc');
  const relatedProducts = response.content.filter(
    (relatedProduct) => relatedProduct.id !== product.id
  );

  return (
    <>
      {relatedProducts.length !== 0 ? (
        <section id="related-products" className="pb-15">
          <div className="container">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-semibold">Sản phẩm liên quan</h3>
            </div>
            <CustomCarousel>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </CustomCarousel>
          </div>
        </section>
      ) : (
        <p>Không có sản phẩm liên quan.</p>
      )}
    </>
  );
}

export default RelatedProducts;
