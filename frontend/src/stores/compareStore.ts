import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CompareItem {
  _id: string | number;
  title: string;
  price: number;
  img: string;
  isInCart: boolean;
  isInCompare: boolean;
  [key: string]: any; // Allow other properties
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
        const exists = compare.some((item) => item._id === product._id);
        
        if (!exists) {
          set({
            compare: [...compare, { ...product, isInCompare: true }],
          });
        }
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          compare: state.compare.filter((item) => item._id !== productId),
        }));
      },

      makeIsInCompareTrue: (productId) => {
        set((state) => ({
          compare: state.compare.map((item) =>
            item._id === productId ? { ...item, isInCompare: true } : item
          ),
        }));
      },

      makeCompareProductIsInCartFalse: (productId) => {
        set((state) => ({
          compare: state.compare.map((item) =>
            item._id === productId ? { ...item, isInCart: false } : item
          ),
        }));
      },

      clearCompare: () => {
        set({ compare: [] });
      },

      // Helper functions
      isInCompare: (productId) => {
        const { compare } = get();
        return compare.some((item) => item._id === productId);
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
