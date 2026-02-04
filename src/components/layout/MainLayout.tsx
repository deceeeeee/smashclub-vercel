import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary selection:text-background font-sans">
            <Navbar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
