import { Link, useNavigate } from "react-router-dom"
import { Bell, User, Menu } from "lucide-react"

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="border-b border-gray-800 bg-background/95 backdrop-blur sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-background font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">SmashClub</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/booking" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Cari Lapangan
                    </Link>
                    <Link to="/community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Komunitas
                    </Link>
                    <Link to="/tournaments" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Turnamen
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-300 hover:text-white">
                        <Bell className="w-5 h-5" />
                    </button>

                    <button onClick={() => navigate('/login')} className="bg-gray-800 p-1.5 rounded-full hover:bg-gray-700 transition-colors">
                        <User className="w-5 h-5 text-gray-300" />
                    </button>

                    <button className="md:hidden text-gray-300">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    )
}
