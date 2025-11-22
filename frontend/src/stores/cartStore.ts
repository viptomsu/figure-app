import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product } from '@/services/types';

export interface CartItem extends Product {
  count: number;
  selectedAttribute?: string;
  isInCart: boolean;
  selectedPrice?: number; // Added based on usage in CartTable/Totals
}

interface CartState {
  cart: CartItem[];
}

interface CartActions {
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string | number, selectedAttribute?: string) => void;
  increaseProductCount: (productId: string | number, selectedAttribute?: string) => void;
  decreaseProductCount: (productId: string | number, selectedAttribute?: string) => void;
  makeIsInCartTrue: (productId: string | number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],

      // Actions
      addToCart: (product) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex(
          (item) =>
            item.id === product.id &&
            (item.selectedAttribute ?? null) === (product.selectedAttribute ?? null)
        );

        if (existingItemIndex !== -1) {
          // Product exists, increment count
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].count += 1;
          set({ cart: updatedCart });
        } else {
          // Product doesn't exist, add it with count 1
          set({
            cart: [...cart, { ...product, count: 1, isInCart: true }],
          });
        }
      },

      removeFromCart: (productId, selectedAttribute) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              item.id !== productId ||
              (item.selectedAttribute ?? null) !== (selectedAttribute ?? null)
          ),
        }));
      },

      increaseProductCount: (productId, selectedAttribute) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId &&
            (item.selectedAttribute ?? null) === (selectedAttribute ?? null)
              ? { ...item, count: item.count + 1 }
              : item
          ),
        }));
      },

      decreaseProductCount: (productId, selectedAttribute) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId &&
            (item.selectedAttribute ?? null) === (selectedAttribute ?? null)
              ? { ...item, count: Math.max(1, item.count - 1) }
              : item
          ),
        }));
      },

      makeIsInCartTrue: (productId) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, isInCart: true } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Helper functions
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.count, 0);
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.count, 0);
      },
    }),
    {
      name: 'cart-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
