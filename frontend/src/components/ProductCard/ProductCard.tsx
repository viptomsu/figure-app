'use client';

import React, { useState } from 'react';
import { BarChart2, Heart, ShoppingBag, Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProductInfo from '../ProductDetails/PrimaryInfo/ProductInfo';
import ImgSlider from '../ProductDetails/PrimaryInfo/ImgSlider';
import Rating from '../Other/Rating';
import { useCartStore, useWishlistStore, useCompareStore } from '@/stores';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Product } from '@/services/types';
import { CartItem } from '@/stores/cartStore';
import { WishlistItem } from '@/stores/wishlistStore';
import { CompareItem } from '@/stores/compareStore';

interface ProductCardProps {
  product: Product & {
    isInCart?: boolean;
    isInWishlist?: boolean;
    isInCompare?: boolean;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { cart, addToCart, makeIsInCartTrue } = useCartStore();
  const { wishlist, addToWishlist } = useWishlistStore();
  const { compare, addToCompare } = useCompareStore();

  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShow = (e: React.MouseEvent<HTMLButtonElement>): void => setShowModal(true);
  const handleClose = (e?: React.MouseEvent<HTMLButtonElement>): void => setShowModal(false);

  // Update states
  cart.map((cartProduct: CartItem) => cartProduct.id === product.id && (product.isInCart = true));
  wishlist.map(
    (wishlistProduct: WishlistItem) =>
      wishlistProduct.id === product.id && (product.isInWishlist = true)
  );
  compare.map(
    (compareProduct: CompareItem) =>
      compareProduct.id === product.id && (product.isInCompare = true)
  );

  const defaultImage = Array.isArray(product.images)
    ? product.images.find((image: any) => image.isDefault)?.imageUrl
    : '/path-to-placeholder-image.jpg';

  return (
    <>
      <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl border border-border/50 hover:border-primary/20">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {/* ======= Badge ======= */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm animate-scale-in">
                -{product.discount}%
              </span>
            </div>
          )}

          {/* ======= Image ======= */}
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            {defaultImage ? (
              <img
                src={defaultImage}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image
              </div>
            )}
          </Link>

          {/* ======= Actions Overlay ======= */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {/* View Details / Add to Cart */}
              {product.variations && product.variations.length > 0 ? (
                <Link href={`/products/${product.id}`}>
                  <button
                    title="Xem chi tiết"
                    className="bg-white text-foreground p-3 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </Link>
              ) : product.isInCart ? (
                <button
                  title="Đã thêm vào giỏ hàng"
                  className="bg-primary/80 text-primary-foreground p-3 rounded-full shadow-lg cursor-not-allowed opacity-80"
                  disabled
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              ) : (
                <button
                  title="Thêm vào giỏ hàng"
                  className="bg-white text-foreground p-3 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    const cartItem: CartItem = {
                      ...product,
                      count: 1,
                      isInCart: true,
                    };
                    addToCart(cartItem);
                    makeIsInCartTrue(product.id);
                    toast.success(`"${product.productName}" đã được thêm vào giỏ hàng`);
                  }}
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              )}

              {/* Quick View */}
              <button
                title="Xem nhanh"
                onClick={handleShow}
                className="bg-white text-foreground p-3 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {product.isInWishlist ? (
                <button
                  title="Đã thích"
                  className="bg-red-500 text-white p-3 rounded-full shadow-lg cursor-not-allowed"
                  disabled
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  title="Yêu thích"
                  className="bg-white text-foreground p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    addToWishlist(product as unknown as WishlistItem);
                    toast.success(`"${product.productName}" đã thêm vào yêu thích`);
                  }}
                >
                  <Heart className="w-5 h-5" />
                </button>
              )}

              {/* Compare */}
              {product.isInCompare ? (
                <button
                  title="Đã thêm so sánh"
                  className="bg-primary/80 text-primary-foreground p-3 rounded-full shadow-lg cursor-not-allowed opacity-80"
                  disabled
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  title="So sánh"
                  className="bg-white text-foreground p-3 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  onClick={() => {
                    addToCompare(product as unknown as CompareItem);
                    toast.success(`"${product.productName}" đã thêm vào so sánh`);
                  }}
                >
                  <BarChart2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ======= Content ======= */}
        <div className="p-5">
          <div className="mb-2">
            <Link
              href={`/products/${product.id}`}
              className="block text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-2 min-h-12"
            >
              {product.productName}
            </Link>
          </div>

          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(product.price * (1 - (product.discount || 0) / 100))}
              </span>
              {product?.discount && product.discount > 0 && (
                <del className="text-sm text-muted-foreground">{formatCurrency(product.price)}</del>
              )}
            </div>
            <Rating value={product.avgRating || 0} />
          </div>
        </div>
      </div>

      {/* ======= Quick View Dialog ======= */}
      <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-2xl">
          <div className="relative">
            <button
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => handleClose()}
            >
              ✕
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gray-50 p-6 flex items-center justify-center">
                <ImgSlider product={product} />
              </div>
              <div className="p-8 max-h-[80vh] overflow-y-auto">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
