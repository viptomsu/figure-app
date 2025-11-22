import { Suspense } from 'react';
import VNPayHandler from '@/components/Checkout/VNPayHandler';

export default function CheckoutVNPayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VNPayHandler />
    </Suspense>
  );
}
