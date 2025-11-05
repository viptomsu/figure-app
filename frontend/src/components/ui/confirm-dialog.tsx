import React, { useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDialog = NiceModal.create<{
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onCancel?: () => void;
}>(({ title, description, onConfirm, confirmText = "Xác nhận", cancelText = "Hủy", variant = "default", onCancel }) => {
  const modal = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      modal.hide();
      setTimeout(() => modal.remove(), 300);
    } catch (error) {
      console.error('Error in confirm dialog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    modal.hide();
    setTimeout(() => modal.remove(), 300);
    onCancel?.();
  };

  return (
    <Dialog open={modal.visible} onOpenChange={(open) => { if (!open) { modal.hide(); setTimeout(() => modal.remove(), 300); onCancel?.(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export { ConfirmDialog };
