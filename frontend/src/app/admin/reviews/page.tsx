'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewTable } from '@/components/Admin/Review/ReviewTable';
import { ReviewDetailModal } from '@/components/Admin/Review/ReviewDetailModal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getAllReviews, Review } from '@/services/client/reviewService';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllReviews(1, 100, searchTerm);
      const data = response.content || response.data || [];
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">Manage customer reviews.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ReviewTable reviews={reviews} isLoading={isLoading} onView={setSelectedReview} />

      <ReviewDetailModal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
      />
    </div>
  );
}
