import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product } from '@/services/types';

export interface WishlistItem extends Product {
  isInCart?: boolean;
  isInWishlist?: boolean;
}

interface WishlistState {
  wishlist: WishlistItem[];
}

interface WishlistActions {
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string | number) => void;
  makeIsInWishlistTrue: (productId: string | number) => void;
  makeWishlistProductIsInCartFalse: (productId: string | number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string | number) => boolean;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial state
      wishlist: [],

      // Actions
      addToWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.some((item) => item.id === product.id);

        if (!exists) {
          set({
            wishlist: [...wishlist, { ...product, isInWishlist: true }],
          });
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));
      },

      makeIsInWishlistTrue: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.map((item) =>
            item.id === productId ? { ...item, isInWishlist: true } : item
          ),
        }));
      },

      makeWishlistProductIsInCartFalse: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.map((item) =>
            item.id === productId ? { ...item, isInCart: false } : item
          ),
        }));
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },

      // Helper function
      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some((item) => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
