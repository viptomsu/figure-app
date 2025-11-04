"use client"

import React, { useState } from "react";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useCartStore, useWishlistStore, useProductsStore } from "../../stores";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/currencyFormatter"; // Hàm format tiền tệ
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ImgSlider from "../ProductDetails/PrimaryInfo/ImgSlider"; // Component for image slider
import ProductInfo from "../ProductDetails/PrimaryInfo/ProductInfo"; // Component for product information

const WishlistSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { cart, addToCart, makeIsInCartTrue } = useCartStore();
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { makeIsInWishlistFalse } = useProductsStore();

  const handleClose = () => setShowModal(false);
  const handleShow = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  cart.forEach((cartProduct: any) => {
    wishlist.forEach((product: any) => {
      if (cartProduct._id === product._id) {
        product.isInCart = cartProduct.isInCart;
      }
    });
  });

  return (
    <section id="wishlist" className="py-20">
      <div className="container">
        <div className="flex justify-center mb-10">
          <h1>Danh sách yêu thích</h1>
        </div>
        {wishlist.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4">Xóa</th>
                  <th className="text-left py-4">Hình ảnh</th>
                  <th className="text-left py-4">Tên</th>
                  <th className="text-left py-4">Giá</th>
                  <th className="text-left py-4">Thêm vào giỏ hàng</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product: any, index: number) => {
                  // Lấy ảnh mặc định từ product.images
                  const defaultImage = product.images.find(
                    (img: any) => img.isDefault
                  )?.imageUrl;

                  // Tính toán giá sau khi giảm
                  const discountPrice =
                    product.price -
                    (product.price * product.discount) / 100;

                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            removeFromWishlist(product._id);
                            makeIsInWishlistFalse(product._id);
                            toast.error(
                              '"' +
                                product.productName +
                                '" đã được xóa khỏi danh sách yêu thích.'
                            );
                          }}
                          className="text-gray-500 hover:text-red-600 text-xl"
                        >
                          ✕
                        </button>
                      </td>
                      <td className="py-4">
                        <Link href={`/products/${product._id}`}>
                          <img
                            src={defaultImage}
                            className="w-20 h-20 object-cover rounded"
                            alt={product.productName}
                          />
                        </Link>
                      </td>
                      <td className="py-4">
                        <Link
                          className="text-primary hover:text-red-700"
                          href={`/products/${product._id}`}
                        >
                          {product.productName}
                        </Link>
                      </td>
                      <td className="py-4">
                        {product.discount ? (
                          <div className="flex items-center gap-2">
                            <p className="m-0 text-gray-500 line-through">
                              {formatCurrency(product.price)}
                            </p>
                            <p className="m-0 text-red-600 font-bold">
                              {formatCurrency(discountPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="m-0 font-bold">
                            {formatCurrency(product.price)}
                          </p>
                        )}
                      </td>
                      <td className="py-4">
                        {product.isInCart ? (
                          <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                            disabled
                          >
                            Đã thêm vào giỏ hàng
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              if (product.variations.length > 0) {
                                handleShow(product);
                              } else {
                                addToCart(product);
                                makeIsInCartTrue(product._id);
                                toast.success(
                                  '"' +
                                    product.productName +
                                    '" đã thêm vào giỏ hàng.'
                                );
                              }
                            }}
                          >
                            Thêm vào giỏ hàng
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Danh sách yêu thích của bạn hiện đang trống.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-red-700">
              <HiArrowNarrowLeft size={20} />
              <span>Quay lại</span>
            </Link>
          </div>
        )}
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
    </section>
  );
};

export default WishlistSection;
