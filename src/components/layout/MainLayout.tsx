import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import CartDrawer from "../../features/shop/CartDrawer"
import ProfileDrawer from "../../features/auth/ProfileDrawer"
import { useAuthStore } from "../../features/auth/auth.store"
import { useQuery } from "@tanstack/react-query"
import { authService } from "../../features/auth/auth.service"

export default function MainLayout() {
    const { token, updateUser, logout } = useAuthStore()

    // Sync session on app initialization
    const { data: sessionData, isError, error } = useQuery({
        queryKey: ["session"],
        queryFn: authService.checkSession,
        enabled: !!token,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (sessionData?.success && sessionData.data) {
            updateUser(sessionData.data)
        } else if (isError) {
            const err = error as any
            if (err.response?.status === 401) {
                logout()
            }
        }
    }, [sessionData, isError, error, updateUser, logout])

    return (
        <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary selection:text-background font-sans">
            <Navbar />
            <CartDrawer />
            <ProfileDrawer />
            <main className="flex-1 w-full">

                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
