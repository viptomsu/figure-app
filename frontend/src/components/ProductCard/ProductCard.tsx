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
      <div className="product-card">
        <div className="card-top">
          {/* ======= Nhãn ======= */}
          {product.discount > 0 && (
            <div
              style={{
                backgroundColor: "#3d7fe3",
                color: "white",
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              <span>-{product.discount}%</span>
            </div>
          )}

          {/* ======= Ảnh ======= */}
          <div className="product-img">
            <Link href={`/products/${product._id}`}>
              {defaultImage ? (
                <img src={defaultImage} alt={product.productName} />
              ) : (
                <img src="/path-to-placeholder-image.jpg" alt="Không có ảnh" />
              )}
            </Link>
          </div>
          {/* ======= Hành động ======= */}
          <div className="product-actions">
            <ul>
              <li>
                {product.variations && product.variations.length > 0 ? (
                  // Nếu sản phẩm có variations, nút sẽ là "Xem chi tiết"
                  <Link href={`/products/${product._id}`}>
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="btn-details"
                    >
                      <span className="cart-icon">
                        <AiOutlineSearch /> {/* Biểu tượng có thể tùy chỉnh */}
                      </span>
                    </button>
                  </Link>
                ) : product.isInCart ? (
                  // Nếu sản phẩm đã được thêm vào giỏ hàng
                  <button
                    type="button"
                    title="Đã thêm vào giỏ hàng"
                    className="disabledBtn"
                    disabled
                  >
                    <span className="cart-icon">
                      <BsBag />
                    </span>
                  </button>
                ) : (
                  // Nếu sản phẩm không có variations và chưa được thêm vào giỏ hàng
                  <button
                    type="button"
                    title="Thêm vào giỏ hàng"
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
                    <span className="cart-icon">
                      <BsBag />
                    </span>
                  </button>
                )}
              </li>

              <li>
                {/* ===== Xem nhanh ===== */}
                <button type="button" title="Xem nhanh" onClick={handleShow}>
                  <span className="eye-icon">
                    <ImEye />
                  </span>
                </button>
              </li>

              <li>
                {product.isInWishlist ? (
                  // ===== Đã thêm vào danh sách yêu thích ===== //
                  <button
                    type="button"
                    title="Đã thêm vào danh sách yêu thích"
                    className="disabledBtn"
                    disabled
                  >
                    <span className="heart-icon">
                      <BsHeart />
                    </span>
                  </button>
                ) : (
                  // ===== Thêm vào danh sách yêu thích ===== //
                  <button
                    type="button"
                    title="Thêm vào danh sách yêu thích"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      addToWishlist(product);
                      toast.success(
                        '"' +
                          product.productName +
                          '" đã thêm vào danh sách yêu thích'
                      );
                    }}
                  >
                    <span className="heart-icon">
                      <BsHeart />
                    </span>
                  </button>
                )}
              </li>

              <li>
                {product.isInCompare ? (
                  // ===== Đã thêm vào phần quan tâm ===== //
                  <button
                    type="button"
                    title="Đã thêm vào phần quan tâm"
                    className="disabledBtn"
                    disabled
                  >
                    <span className="compare-icon">
                      <FiBarChart2 />
                    </span>
                  </button>
                ) : (
                  // ===== Thêm vào phần quan tâm ===== //
                  <button
                    type="button"
                    title="Thêm vào phần quan tâm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      addToCompare(product);
                      toast.success(
                        '"' +
                          product.productName +
                          '" đã thêm vào phần quan tâm'
                      );
                    }}
                  >
                    <span className="compare-icon">
                      <FiBarChart2 />
                    </span>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
        {/* ======= Giá ======= */}
        <div className="product-price">
          <p>
            <span>
              {formatCurrency(product.price * (1 - product.discount / 100))}
            </span>
            {product?.discount && <del> {formatCurrency(product.price)}</del>}
          </p>
        </div>
        {/* ======= Tiêu đề (giới hạn 2 dòng) ======= */}
        <div
          className="product-title"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2, // Giới hạn số dòng
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <h6>
            <Link href={`/products/${product._id}`}>
              {product.productName}
            </Link>
          </h6>
        </div>

        {/* ======= Đánh giá ======= */}
        <div className="product-rating">
          <Rating value={product.avgRating} />
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
