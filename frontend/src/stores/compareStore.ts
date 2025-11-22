import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product } from '@/services/types';

export interface CompareItem extends Product {
  isInCart?: boolean;
  isInCompare?: boolean;
}

interface CompareState {
  compare: CompareItem[];
}

interface CompareActions {
  addToCompare: (product: CompareItem) => void;
  removeFromCompare: (productId: string | number) => void;
  makeIsInCompareTrue: (productId: string | number) => void;
  makeCompareProductIsInCartFalse: (productId: string | number) => void;
  clearCompare: () => void;
  isInCompare: (productId: string | number) => boolean;
  getCompareItemsCount: () => number;
}

type CompareStore = CompareState & CompareActions;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      // Initial state
      compare: [],

      // Actions
      addToCompare: (product) => {
        const { compare } = get();
        const exists = compare.some((item) => item.id === product.id);

        if (!exists) {
          set({
            compare: [...compare, { ...product, isInCompare: true }],
          });
        }
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          compare: state.compare.filter((item) => item.id !== productId),
        }));
      },

      makeIsInCompareTrue: (productId) => {
        set((state) => ({
          compare: state.compare.map((item) =>
            item.id === productId ? { ...item, isInCompare: true } : item
          ),
        }));
      },

      makeCompareProductIsInCartFalse: (productId) => {
        set((state) => ({
          compare: state.compare.map((item) =>
            item.id === productId ? { ...item, isInCart: false } : item
          ),
        }));
      },

      clearCompare: () => {
        set({ compare: [] });
      },

      // Helper functions
      isInCompare: (productId) => {
        const { compare } = get();
        return compare.some((item) => item.id === productId);
      },

      getCompareItemsCount: () => {
        const { compare } = get();
        return compare.length;
      },
    }),
    {
      name: 'compare-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
