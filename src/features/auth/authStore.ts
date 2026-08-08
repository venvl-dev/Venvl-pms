import {create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean
  isBootstrapping: boolean
  setAuthenticated: () => void
  clearAuth: () => void
  setBootstrapped: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isBootstrapping: true,
  setAuthenticated: () => set({ isAuthenticated: true }),
  clearAuth: () => set({ isAuthenticated: false }),
  setBootstrapped: () => set({ isBootstrapping: false }),
}))
    
