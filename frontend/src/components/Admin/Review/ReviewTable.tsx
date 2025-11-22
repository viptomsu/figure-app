'use client';

import { Review } from '@/services/client/reviewService';
import { Button } from '@/components/ui/button';
import { Eye, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReviewTableProps {
  reviews: Review[];
  isLoading: boolean;
  onView: (review: Review) => void;
}

export function ReviewTable({ reviews, isLoading, onView }: ReviewTableProps) {
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                No reviews found
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((item) => (
              <TableRow key={item.id || item.reviewId}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {item.product.productName}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{item.user.fullName}</span>
                    <span className="text-xs text-gray-500">{item.user.phoneNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {item.rating} <Star className="w-3 h-3 text-yellow-400 ml-1 fill-yellow-400" />
                  </div>
                </TableCell>
                <TableCell>{new Date(item.reviewDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
