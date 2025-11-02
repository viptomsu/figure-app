import { create } from 'zustand';
import { IProducts } from '../types/types';
import { products } from '../data/products';

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
  makeIsInCartFalse: (productId: number) => void;
  makeIsInWishlistFalse: (productId: number) => void;
  makeIsInCompareFalse: (productId: number) => void;
  resetProducts: () => void;
  setProducts: (newProducts: IProducts[]) => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set, get) => ({
  // Initial state
  products: [...products],
  searchedProducts: [],
  allProducts: [...products], // Keep original copy for filtering

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
    const filteredProducts = allProducts.filter((product) =>
      product.category.indexOf(category) !== -1
    );
    set({ products: filteredProducts });
  },

  sortByBrand: (brand) => {
    const { allProducts } = get();
    const filteredProducts = allProducts.filter((product) =>
      product.brand.indexOf(brand) !== -1
    );
    set({ products: filteredProducts });
  },

  searchProduct: (searchTerm) => {
    const { allProducts } = get();
    const filteredProducts = allProducts.filter((product) =>
      product.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
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
    set({ 
      products: newProducts,
      allProducts: newProducts,
      searchedProducts: []
    });
  },
}));
