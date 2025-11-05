"use client";

import NiceModal from "@ebay/nice-modal-react";
import { Toaster } from "@/components/ui/toaster";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <NiceModal.Provider>
      {children}
      <Toaster />
    </NiceModal.Provider>
  );
}
