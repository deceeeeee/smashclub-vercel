import { Link, useNavigate } from "react-router-dom"
import { Bell, User, Menu, ShoppingBag } from "lucide-react"
import { useShopStore } from "../../features/shop/shop.store"
import { useAuthStore } from "../../features/auth/auth.store"

export default function Navbar() {
    const navigate = useNavigate();
    const { toggleCart, getTotalItems } = useShopStore();
    const { token, toggleProfile } = useAuthStore();
    const totalItems = getTotalItems();

    const handleUserClick = () => {
        if (token) {
            toggleProfile(true);
        } else {
            navigate('/login');
        }
    };

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
                    <Link to="/shop" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Katalog
                    </Link>
                    <Link to="/community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Komunitas
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => toggleCart()}
                        className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>

                    <button onClick={handleUserClick} className="bg-gray-800 p-1.5 rounded-full hover:bg-gray-700 transition-colors">
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
