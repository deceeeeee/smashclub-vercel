import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    token: string | null
    refreshToken: string | null
    user: any
    isProfileOpen: boolean
    walletBalance: number
    login: (token: string, refreshToken: string, user: any) => void
    logout: () => void
    setToken: (token: string, refreshToken?: string) => void
    toggleProfile: (open?: boolean) => void
    updateUser: (user: any) => void
    updateBalance: (amount: number) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            user: null,
            isProfileOpen: false,
            walletBalance: 250000, // Mock initial balance
            login: (token, refreshToken, user) => set({ token, refreshToken, user }),
            logout: () => {
                set({ token: null, refreshToken: null, user: null, isProfileOpen: false });
                localStorage.removeItem('auth-storage');
            },
            setToken: (token, refreshToken) => set((state) => ({
                token,
                refreshToken: refreshToken || state.refreshToken
            })),
            toggleProfile: (open) => set((state) => ({
                isProfileOpen: open !== undefined ? open : !state.isProfileOpen
            })),
            updateUser: (user) => set((state) => ({
                user: { ...state.user, ...user }
            })),
            updateBalance: (amount) => set((state) => ({
                walletBalance: state.walletBalance + amount
            })),
        }),
        {
            name: "auth-storage",
        }
    )
)
