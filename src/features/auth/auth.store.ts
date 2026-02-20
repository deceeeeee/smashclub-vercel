import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authService } from "./auth.service"

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
    fetchWalletBalance: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            user: null,
            isProfileOpen: false,
            walletBalance: 0,
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
            fetchWalletBalance: async () => {
                try {
                    const response = await authService.getWalletBalance()
                    if (response.success && response.data) {
                        set({ walletBalance: response.data.userBalance })
                    }
                } catch (error) {
                    console.error("Failed to fetch wallet balance:", error)
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
)
