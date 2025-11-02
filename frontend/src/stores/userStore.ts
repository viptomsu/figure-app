import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

interface UserActions {
  loginSuccess: (userData: { user: any; token: string }) => void;
  loginFailure: (errorMessage: string) => void;
  logout: () => void;
  updateUserProfile: (updatedData: any) => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,

      // Actions
      loginSuccess: (userData) => {
        set({
          user: userData.user,
          token: userData.token,
          isAuthenticated: true,
          error: null,
        });
      },

      loginFailure: (errorMessage) => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: errorMessage,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUserProfile: (updatedData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedData },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
