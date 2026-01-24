/**
 * User Store - Manages user authentication and profile data
 * Implements REQ-10.1.5: User state management via Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, DarkMode } from '@types/index';

interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  darkMode: DarkMode;
  skipFilledSquares: boolean;
  history: {
    solvedPuzzles: string[];
    compositions: string[];
  };

  // Actions
  setUser: (user: User | null) => void;
  updateUserName: (name: string) => void;
  updateUserColor: (color: string) => void;
  setDarkMode: (mode: DarkMode) => void;
  setSkipFilledSquares: (shouldSkip: boolean) => void;
  addSolvedPuzzle: (puzzleId: string) => void;
  addComposition: (compositionId: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        darkMode: 'system',
        skipFilledSquares: true,
        history: {
          solvedPuzzles: [],
          compositions: [],
        },

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        updateUserName: (name) =>
          set((state) => ({
            user: state.user ? { ...state.user, displayName: name } : null,
          })),

        updateUserColor: (color) =>
          set((state) => ({
            user: state.user ? { ...state.user, color } : null,
          })),

        setDarkMode: (mode) => set({ darkMode: mode }),

        setSkipFilledSquares: (shouldSkip) => set({ skipFilledSquares: shouldSkip }),

        addSolvedPuzzle: (puzzleId) =>
          set((state) => ({
            history: {
              ...state.history,
              solvedPuzzles: [...new Set([...state.history.solvedPuzzles, puzzleId])],
            },
          })),

        addComposition: (compositionId) =>
          set((state) => ({
            history: {
              ...state.history,
              compositions: [...new Set([...state.history.compositions, compositionId])],
            },
          })),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          darkMode: state.darkMode,
          skipFilledSquares: state.skipFilledSquares,
          history: state.history,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);
