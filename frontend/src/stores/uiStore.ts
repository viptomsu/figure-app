import { create } from 'zustand';

interface UIState {
  title: string;
  showSidebarCategories: boolean;
  showSidebarMenu: boolean;
  isLoading: boolean;
  showSearchArea: boolean;
  showOrHideDropdownCart: boolean;
  showSidebarFilter: boolean;
}

interface UIActions {
  setTitle: (title: string) => void;
  setShowSidebarCategories: (show: boolean) => void;
  setShowSidebarMenu: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setShowSearchArea: (show: boolean) => void;
  toggleDropdownCart: () => void;
  setShowSidebarFilter: (show: boolean) => void;
  resetUI: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  title: '',
  showSidebarCategories: false,
  showSidebarMenu: false,
  isLoading: false,
  showSearchArea: true,
  showOrHideDropdownCart: false,
  showSidebarFilter: false,

  // Actions
  setTitle: (title) => set({ title }),

  setShowSidebarCategories: (show) => set({ showSidebarCategories: show }),

  setShowSidebarMenu: (show) => set({ showSidebarMenu: show }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setShowSearchArea: (show) => set({ showSearchArea: show }),

  toggleDropdownCart: () => set((state) => ({ showOrHideDropdownCart: !state.showOrHideDropdownCart })),

  setShowSidebarFilter: (show) => set({ showSidebarFilter: show }),

  resetUI: () => set({
    title: '',
    showSidebarCategories: false,
    showSidebarMenu: false,
    isLoading: false,
    showSearchArea: true,
    showOrHideDropdownCart: false,
    showSidebarFilter: false,
  }),
}));
