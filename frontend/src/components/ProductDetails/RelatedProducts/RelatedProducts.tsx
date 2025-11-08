import { getAllProductsServer } from '@/services/server';
import CustomCarousel from '../../Other/CustomCarousel';
import ProductCard from '../../ProductCard/ProductCard';

async function RelatedProducts({ product }: { product: any }) {
  const categoryId = product?.category?._id;

  if (!categoryId) {
    return <p>Không có sản phẩm liên quan.</p>;
  }

  const response = await getAllProductsServer('', categoryId, null, 1, 10, 'productName', 'asc');
  const relatedProducts = response.content.filter(
    (relatedProduct: any) => relatedProduct._id !== product._id
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
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
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
