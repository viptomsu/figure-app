'use client';

/**
 * Client-side product UI state management.
 * This store manages CLIENT-SIDE UI state for products (isInCart, isInWishlist, isInCompare flags) and basic filtering.
 * It does NOT fetch data from the server. Products are initialized empty as they are managed via props in Server Components.
 *
 * Usage: Used by components for UI state updates:
 * - makeIsInCartFalse (8 usages) - Updates cart flag when items are removed
 * - makeIsInWishlistFalse (4 usages) - Updates wishlist flag when items are removed
 * - makeIsInCompareFalse (3 usages) - Updates compare flag when items are removed
 * - sortByBrand (1 usage) - Filters products by brand in Brands component
 */
import { create } from 'zustand';
import { IProducts } from '../types/types';

interface ProductsState {
  products: IProducts[];
  searchedProducts: IProducts[];
  allProducts: IProducts[]; // Keep original products reference
}

interface ProductsActions {
  sortByLatestAndPrice: (sortType: 'latest' | 'lowPrice' | 'highPrice' | 'default') => void;
  sortByCategory: (category: string) => void;
  sortByBrand: (brand: string) => void;
  searchProduct: (searchTerm: string) => void;
  makeIsInCartFalse: (productId: string) => void;
  makeIsInWishlistFalse: (productId: string) => void;
  makeIsInCompareFalse: (productId: string) => void;
  resetProducts: () => void;
  setProducts: (newProducts: IProducts[]) => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Initial state
  products: [],
  searchedProducts: [],
  allProducts: [], // Keep original copy for filtering

  // Actions
  sortByLatestAndPrice: (sortType) => {
    const { allProducts } = get();
    let sortedProducts = [...allProducts];

    switch (sortType) {
      case 'latest':
        sortedProducts.sort((a, b) => (a.id < b.id ? 1 : -1));
        break;
      case 'lowPrice':
        sortedProducts.sort((a, b) => (a.price > b.price ? 1 : -1));
        break;
      case 'highPrice':
        sortedProducts.sort((a, b) => (a.price < b.price ? 1 : -1));
        break;
      default:
        sortedProducts.sort((a, b) => (a.id > b.id ? 1 : -1));
        break;
    }

    set({ products: sortedProducts });
  },

  sortByCategory: (category) => {
    const { allProducts } = get();
    const filteredProducts = allProducts.filter(
      (product) => product.category.indexOf(category) !== -1
    );
    set({ products: filteredProducts });
  },

  sortByBrand: (brand) => {
    const { allProducts } = get();
    const filteredProducts = allProducts.filter((product) => product.brand.indexOf(brand) !== -1);
    set({ products: filteredProducts });
  },

  searchProduct: (searchTerm) => {
    const { allProducts } = get();
    const filteredProducts = allProducts.filter(
      (product) => product.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
    set({ searchedProducts: filteredProducts });
  },

  makeIsInCartFalse: (productId) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, isInCart: false } : product
      ),
      allProducts: state.allProducts.map((product) =>
        product.id === productId ? { ...product, isInCart: false } : product
      ),
    }));
  },

  makeIsInWishlistFalse: (productId) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, isInWishlist: false } : product
      ),
      allProducts: state.allProducts.map((product) =>
        product.id === productId ? { ...product, isInWishlist: false } : product
      ),
    }));
  },

  makeIsInCompareFalse: (productId) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, isInCompare: false } : product
      ),
      allProducts: state.allProducts.map((product) =>
        product.id === productId ? { ...product, isInCompare: false } : product
      ),
    }));
  },

  resetProducts: () => {
    const { allProducts } = get();
    set({ products: [...allProducts] });
  },

  setProducts: (newProducts) => {
    // Note: Currently unused in production. Products are passed as props from Server Components instead of being stored in Zustand.
    set({
      products: newProducts,
      allProducts: newProducts,
      searchedProducts: [],
    });
  },
}));
