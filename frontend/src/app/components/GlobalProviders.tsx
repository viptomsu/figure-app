'use client';

import NiceModal from '@ebay/nice-modal-react';
import { Toaster } from '@/components/ui/toaster';

export default function GlobalProviders() {
  return (
    <NiceModal.Provider>
      <Toaster />
      {/* NiceModal.Provider is initialized programmatically */}
    </NiceModal.Provider>
  );
}
