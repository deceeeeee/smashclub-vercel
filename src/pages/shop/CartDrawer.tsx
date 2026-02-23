import { ShoppingCart, X, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { useShopStore } from '../../features/shop/shop.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cart, updateQuantity, getSubtotal, fetchCart, isLoading } = useShopStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isCartOpen && token) {
            fetchCart();
        }
    }, [isCartOpen, token, fetchCart]);

    const handleCheckout = () => {
        toggleCart(false);
        navigate('/shop/checkout');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => toggleCart(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md flex flex-col bg-[#051111] shadow-2xl border-l border-gray-800">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-card/20">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-white">Keranjang Belanja</h2>
                        </div>
                        <button
                            onClick={() => toggleCart(false)}
                            className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto py-6 px-6">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-gray-400">Memuat keranjang...</p>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-10 h-10 text-gray-700" />
                                </div>
                                <p className="text-gray-400 font-medium">Keranjang Anda kosong</p>
                                <button
                                    onClick={() => {
                                        navigate("/shop");
                                        toggleCart(false)
                                    }}
                                    className="mt-4 text-primary hover:underline font-bold"
                                >
                                    Mulai Belanja
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cart.map((item) => (
                                    <li key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-gray-800">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-contain p-2"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-bold text-white">
                                                    <h3>{item.name}</h3>
                                                </div>
                                                <p className="mt-1 text-xs text-primary">{item.category}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <p className="font-bold text-white">{formatPrice(item.price)}</p>

                                                <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-800">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-primary transition-colors text-white"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="mx-2 w-4 text-center text-white font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-primary transition-colors text-white"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-gray-800 px-6 py-6 bg-card/10">
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <p>Subtotal</p>
                                    <p>{formatPrice(getSubtotal())}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <p>Estimasi Pengiriman</p>
                                    <p className="text-primary font-bold">Gratis</p>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white border-t border-gray-800 pt-4">
                                    <p>Total</p>
                                    <p className="text-primary">{formatPrice(getSubtotal())}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-background font-black hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                Lanjut ke Pembayaran
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="mt-4 text-center text-[10px] text-gray-500">
                                Pajak dan ongkos kirim dihitung saat checkout
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
