import type { User } from '@/features/auth/types';
import {create } from 'zustand';

interface AuthState{
    accessToken:string|null,
    user:User|null,
    // FLAGGGGG to see previous login session 
    isBootstrapping: boolean,  
    setAuth: (accessToken: string, user: User) => void
    setAccessToken: (accessToken: string) => void
  clearAuth: () => void
  setBootstrapped: () => void

}

export const useAuthStore = create<AuthState>((set) => ({
 accessToken: null,
  user: null,
  isBootstrapping: true,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setBootstrapped: () => set({ isBootstrapping: false }),
}))
    
export const getAccessToken = () => useAuthStore.getState().accessToken
