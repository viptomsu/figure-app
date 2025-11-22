'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Review } from '@/services/client/reviewService';
import { Star } from 'lucide-react';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export function ReviewDetailModal({ isOpen, onClose, review }: ReviewDetailModalProps) {
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-500">Product</div>
            <div className="col-span-2">{review.product.productName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-500">User</div>
            <div className="col-span-2">
              <div>{review.user.fullName}</div>
              <div className="text-sm text-gray-500">{review.user.phoneNumber}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-500">Rating</div>
            <div className="col-span-2 flex items-center">
              {review.rating} <Star className="w-4 h-4 text-yellow-400 ml-1 fill-yellow-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-500">Date</div>
            <div className="col-span-2">{new Date(review.reviewDate).toLocaleDateString()}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-gray-500">Comment</div>
            <div className="p-3 bg-gray-50 rounded-md text-sm">{review.reviewText}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
