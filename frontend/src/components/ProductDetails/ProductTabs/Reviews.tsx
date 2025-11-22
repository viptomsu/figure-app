'use client';

import React, { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import {
  getReviewsByProduct,
  createReview,
  checkProfanityWithHuggingFace,
} from '@/services/client';
import { toast } from 'sonner';
import { useUserStore } from '@/stores';

const Reviews: React.FC<any> = ({ product }) => {
  const [rows] = useState<number>(7);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Lấy thông tin người dùng từ Zustand store
  const { user } = useUserStore();
  const fetchReviews = async (page: number = 1, size: number = 5) => {
    try {
      const response = await getReviewsByProduct(product.id, page, size);
      setReviews(response.content);
      setTotalPages(response.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error('Error fetching reviews: ', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews(currentPage); // Gọi API cho trang hiện tại
  }, [product, currentPage]); // Khi product hoặc currentPage thay đổi thì gọi lại API

  // Hàm để ẩn 5 chữ số giữa của số điện thoại
  const maskPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/(\d{3})\d{5}(\d{2})/, '$1*****$2');
  };

  // Hàm xử lý gửi review
  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.warning('Vui lòng đăng nhập để đánh giá.');
      return;
    }

    if (!reviewText || rating === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin đánh giá.');
      return;
    }

    setIsSubmitting(true); // Bật loading khi gửi đánh giá

    try {
      // Kiểm tra nội dung bằng Hugging Face AI
      const isProfane = await checkProfanityWithHuggingFace(reviewText);
      if (isProfane) {
        toast.error('Đánh giá của bạn có chứa từ ngữ không phù hợp.');
        setIsSubmitting(false); // Tắt loading nếu đánh giá không hợp lệ
        return;
      }

      // Gửi đánh giá nếu hợp lệ
      await createReview(product.id, user.id, reviewText, rating);
      toast.success('Đánh giá của bạn đã được gửi thành công!');

      // Xóa nội dung sau khi gửi
      setReviewText('');
      setRating(0);
      fetchReviews(currentPage);
    } catch (error) {
      toast.error('Lỗi khi đánh giá.');
      console.error('Error submitting review: ', error);
    } finally {
      setIsSubmitting(false); // Tắt loading sau khi hoàn tất
    }
  };

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true); // Hiển thị loading khi chuyển trang
  };

  return (
    <div>
      <h6 className="text-lg font-semibold mb-4">Gửi đánh giá của bạn</h6>
      <form onSubmit={handleSubmitReview}>
        <div className="mb-2.5">
          <p className="text-sm text-gray-600 mb-2">Xếp hạng của bạn cho sản phẩm này</p>
          <div className="flex flex-row">
            {[...Array(5)].map((_, i) => (
              <label key={i} className="mr-1">
                <input
                  type="radio"
                  name="rate"
                  value={i + 1}
                  onClick={() => setRating(i + 1)}
                  className="hidden"
                />
                <AiFillStar
                  className="text-2xl cursor-pointer"
                  style={{
                    color: i + 1 <= rating ? 'gold' : '#dfdbdb',
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <textarea
            name="review"
            className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-primary"
            placeholder="Viết đánh giá của bạn tại đây"
            rows={rows}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <div className="pt-6">
            <input
              type="submit"
              value={isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-white rounded border-none cursor-pointer ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-red-700'
              } transition-all duration-300`}
            />
          </div>
        </div>
      </form>

      {/* Hiển thị các đánh giá */}
      <div className="mt-7.5">
        <h6 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h6>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review: any, index: number) => (
            <div key={index} className="p-2.5 border-b border-gray-200 mb-2.5">
              <div className="flex justify-between items-center font-semibold mb-2">
                <strong>
                  {review.user.fullName} ({maskPhoneNumber(review.user.phoneNumber)})
                </strong>
                <span className="text-sm text-gray-600">
                  {new Date(review.reviewDate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex flex-row mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <AiFillStar key={i} className="text-primary" />
                ))}
              </div>
              <p className="text-gray-600">{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}

        {/* Nút phân trang */}
        {totalPages > 1 && (
          <div className="flex gap-2 mt-5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1.5 rounded border ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'bg-white text-black border-gray-200 hover:bg-gray-100'
                } transition-all duration-300`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
