import { create } from 'zustand';

interface UserState {
  user: any;
}

interface UserActions {
  loginSuccess: (user: any) => void;
  logout: () => void;
  updateUserProfile: (updatedData: any) => void;
  setUser: (user: any) => void;
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
