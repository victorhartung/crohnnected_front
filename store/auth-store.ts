
import { create } from 'zustand'
import { UserRole } from '@prisma/client'

interface User {
  id: string
  email: string
  name?: string | null
  role: UserRole
  profile?: any
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null })
}))
