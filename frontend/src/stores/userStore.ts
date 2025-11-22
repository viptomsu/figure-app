/**
 * Client-side user state management for mutations only (login, logout, profile updates).
 * Components should call getCurrentUserServer() directly for reading user data (server-side with cache()).
 * This store is used only for client-side mutations that update user state after user actions.
 */
import { create } from 'zustand';
import { User } from '@/services/types';

interface UserState {
  user: User | null;
}

interface UserActions {
  loginSuccess: (user: User) => void;
  logout: () => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  setUser: (user: User | null) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  (set, get) => ({
    // Initial state
    user: null,

    // Actions
    loginSuccess: (user) => {
      set({
        user: user,
      });
    },

    logout: () => {
      set({
        user: null,
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

    setUser: (user) => set({ user }),
  })
);
