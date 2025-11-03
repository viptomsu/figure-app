import React, { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart, BsBag } from "react-icons/bs";
import { ImEye } from "react-icons/im";
import Link from "next/link";
import { Modal } from "react-bootstrap";
import ProductInfo from "../ProductDetails/PrimaryInfo/ProductInfo";
import ImgSlider from "../ProductDetails/PrimaryInfo/ImgSlider";
import { AiOutlineSearch } from "react-icons/ai";
import Rating from "../Other/Rating";
import { IProducts } from "../../types/types";
import { useCartStore, useWishlistStore, useCompareStore } from "../../stores";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/currencyFormatter"; // Import hàm formatCurrency

interface IImage {
  imageId: number;
  imageUrl: string;
  isDefault: boolean;
}

const ProductCard: React.FC<any> = ({ product }) => {
  const { cart, addToCart, makeIsInCartTrue } = useCartStore();
  const { wishlist, addToWishlist } = useWishlistStore();
  const { compare, addToCompare } = useCompareStore();

  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShow = (e: React.MouseEvent<HTMLButtonElement>): void =>
    setShowModal(true);
  const handleClose = (e?: React.MouseEvent<HTMLButtonElement>): void =>
    setShowModal(false);

  // Cập nhật trạng thái isInCart, isInWishlist, isInCompare
  cart.map(
    (cartProduct: any) =>
      cartProduct._id === product._id && (product.isInCart = true)
  );
  wishlist.map(
    (wishlistProduct: any) =>
      wishlistProduct._id === product._id && (product.isInWishlist = true)
  );
  compare.map(
    (compareProduct: any) =>
      compareProduct._id === product._id && (product.isInCompare = true)
  );

  // Tìm ảnh có cờ isDefault: true
  const defaultImage = Array.isArray(product.images)
    ? product.images.find((image: IImage) => image.isDefault)?.imageUrl
    : "/path-to-placeholder-image.jpg"; // Đường dẫn mặc định nếu không có hình ảnh

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="relative">
          {/* ======= Nhãn ======= */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
              <span>-{product.discount}%</span>
            </div>
          )}

          {/* ======= Ảnh ======= */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            <Link href={`/products/${product._id}`} className="block w-full h-full">
              {defaultImage ? (
                <img src={defaultImage} alt={product.productName} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              ) : (
                <img src="/path-to-placeholder-image.jpg" alt="Không có ảnh" className="w-full h-full object-cover" />
              )}
            </Link>
          </div>
          {/* ======= Hành động ======= */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <ul className="flex space-x-2">
              <li>
                {product.variations && product.variations.length > 0 ? (
                  // Nếu sản phẩm có variations, nút sẽ là "Xem chi tiết"
                  <Link href={`/products/${product._id}`}>
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                    >
                      <AiOutlineSearch className="text-lg" />
                    </button>
                  </Link>
                ) : product.isInCart ? (
                  // Nếu sản phẩm đã được thêm vào giỏ hàng
                  <button
                    type="button"
                    title="Đã thêm vào giỏ hàng"
                    className="bg-gray-400 p-2 rounded-full shadow-md text-white cursor-not-allowed"
                    disabled
                  >
                    <BsBag className="text-lg" />
                  </button>
                ) : (
                  // Nếu sản phẩm không có variations và chưa được thêm vào giỏ hàng
                  <button
                    type="button"
                    title="Thêm vào giỏ hàng"
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      addToCart(product);
                      makeIsInCartTrue(product._id);
                      toast.success(
                        '"' +
                          product.productName +
                          '" đã được thêm vào giỏ hàng'
                      );
                    }}
                  >
                    <BsBag className="text-lg" />
                  </button>
                )}
              </li>

              <li>
                {/* ===== Xem nhanh ===== */}
                <button type="button" title="Xem nhanh" onClick={handleShow} className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300">
                  <ImEye className="text-lg" />
                </button>
              </li>

              <li>
                {product.isInWishlist ? (
                  // ===== Đã thêm vào danh sách yêu thích ===== //
                  <button
                    type="button"
                    title="Đã thêm vào danh sách yêu thích"
                    className="bg-gray-400 p-2 rounded-full shadow-md text-white cursor-not-allowed"
                    disabled
                  >
                    <BsHeart className="text-lg" />
                  </button>
                ) : (
                  // ===== Thêm vào danh sách yêu thích ===== //
                  <button
                    type="button"
                    title="Thêm vào danh sách yêu thích"
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      addToWishlist(product);
                      toast.success(
                        '"' +
                          product.productName +
                          '" đã thêm vào danh sách yêu thích'
                      );
                    }}
                  >
                    <BsHeart className="text-lg" />
                  </button>
                )}
              </li>

              <li>
                {product.isInCompare ? (
                  // ===== Đã thêm vào phần quan tâm ===== //
                  <button
                    type="button"
                    title="Đã thêm vào phần quan tâm"
                    className="bg-gray-400 p-2 rounded-full shadow-md text-white cursor-not-allowed"
                    disabled
                  >
                    <FiBarChart2 className="text-lg" />
                  </button>
                ) : (
                  // ===== Thêm vào phần quan tâm ===== //
                  <button
                    type="button"
                    title="Thêm vào phần quan tâm"
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      addToCompare(product);
                      toast.success(
                        '"' +
                          product.productName +
                          '" đã thêm vào phần quan tâm'
                      );
                    }}
                  >
                    <FiBarChart2 className="text-lg" />
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4">
          {/* ======= Giá ======= */}
          <div className="product-price flex items-center font-semibold">
            <p className="text-red-600 text-lg">
              <span>
                {formatCurrency(product.price * (1 - product.discount / 100))}
              </span>
              {product?.discount && <del className="text-gray-400 text-sm ml-2"> {formatCurrency(product.price)}</del>}
            </p>
          </div>
          {/* ======= Tiêu đề (giới hạn 2 dòng) ======= */}
          <div className="product-title line-clamp-2 overflow-hidden text-ellipsis mb-2">
            <h6 className="text-sm font-normal">
              <Link href={`/products/${product._id}`} className="text-gray-700 hover:text-red-600 transition-colors">
                {product.productName}
              </Link>
            </h6>
          </div>

          {/* ======= Đánh giá ======= */}
          <div className="product-rating">
            <Rating value={product.avgRating} />
          </div>
        </div>
      </div>

      {/* ======= Modal Thêm vào giỏ hàng ======= */}
      <Modal show={showModal} onHide={handleClose} className="quick-view-modal">
        <Modal.Body>
          <div className="d-flex justify-content-end">
            <button className="btnClose" onClick={() => handleClose()}>
              ✖
            </button>
          </div>
          <div className="modal-product-info">
            <div className="row">
              <div className="col-lg-6">
                <ImgSlider product={product} />
              </div>
              <div className="col-lg-6">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductCard;
