import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore, useCompareStore, useProductsStore } from '../../stores';
import { toast } from 'sonner';
import Rating from '../Other/Rating';
import { formatCurrency } from '../../utils/currencyFormatter'; // Import hàm format tiền tệ
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ImgSlider from '../ProductDetails/PrimaryInfo/ImgSlider';
import ProductInfo from '../ProductDetails/PrimaryInfo/ProductInfo';
import { Product } from '@/services/types';
import { CartItem } from '@/stores/cartStore';

interface ProductItemProps {
  product: Product & { isInCart?: boolean; variations?: any[] };
}

const ProductItem = ({ product }: ProductItemProps) => {
  // Using any for product to avoid breaking complex types for now, but removing React.FC
  const { cart, addToCart, makeIsInCartTrue } = useCartStore();
  const { removeFromCompare } = useCompareStore();
  const { makeIsInCompareFalse } = useProductsStore();

  const [showModal, setShowModal] = useState(false); // State để điều khiển modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // State để lưu sản phẩm được chọn

  // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
  cart.map((cartProduct) => cartProduct.id === product.id && (product.isInCart = true));

  // Lấy ảnh mặc định (isDefault = true)
  const defaultImage = product.images?.find((image) => image.isDefault)?.imageUrl;

  const handleAddToCart = () => {
    // Kiểm tra nếu có variation thì hiển thị modal
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product); // Lưu sản phẩm đã chọn
      setShowModal(true); // Hiển thị modal
    } else {
      // Nếu không có variation, thêm thẳng vào giỏ hàng
      const cartItem: CartItem = { ...product, count: 1, isInCart: true };
      addToCart(cartItem);
      makeIsInCartTrue(product.id);
      toast.success('"' + product.productName + '" đã thêm vào giỏ hàng.');
    }
  };

  const handleClose = () => setShowModal(false); // Đóng modal

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative p-4">
        <button
          type="button"
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 text-gray-500 hover:text-red-600 shadow-sm"
          onClick={() => {
            removeFromCompare(product.id);
            makeIsInCompareFalse(product.id);
            toast.error('"' + product.productName + '" đã được xóa khỏi phần quan tâm.');
          }}
        >
          ✕
        </button>
        <Link href={`/products/${product.id}`}>
          <img
            src={defaultImage}
            alt={product.productName}
            className="w-full h-48 object-cover rounded"
          />
        </Link>
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-2">
          <h6 className="text-lg font-semibold">
            <Link className="text-primary hover:text-red-700" href={`/products/${product.id}`}>
              {product.productName}
            </Link>
          </h6>
        </div>

        <div className="mb-4">
          {product.discount ? (
            <div className="flex items-center gap-2">
              <p className="m-0 text-gray-500 line-through">{formatCurrency(product.price)}</p>
              <p className="m-0 text-red-600 font-bold">
                {formatCurrency(product.price - (product.price * product.discount) / 100)}
              </p>
            </div>
          ) : (
            <p className="m-0 font-bold text-lg">{formatCurrency(product.price)}</p>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {product.variations?.map((variation, index) => (
            <div key={index} className="px-5 py-2 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-sm">{variation.attributeValue}</strong>
                </div>
                <div>
                  <p className="font-bold text-sm m-0">{formatCurrency(variation.price)}</p>
                  <p className="m-0 text-xs text-gray-600">Số lượng: {variation.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <Rating value={product.avgRating || 0} />
        </div>

        <div className="mt-auto">
          {product.isInCart ? (
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
              disabled
            >
              Đã thêm vào giỏ hàng
            </button>
          ) : (
            <button
              type="button"
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-red-700 transition-all duration-300"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-end mb-4">
            <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
              ✖
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ImgSlider product={selectedProduct} />
            </div>
            <div>
              <ProductInfo product={selectedProduct} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItem;
