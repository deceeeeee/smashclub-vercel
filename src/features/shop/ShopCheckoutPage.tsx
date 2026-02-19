import { Link, useNavigate } from "react-router-dom"
import { CreditCard, Shield, ShoppingBag, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { useShopStore } from "./shop.store"

export default function ShopCheckoutPage() {
    const { cart, getSubtotal, addOrder } = useShopStore()
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState("va")

    const subtotal = getSubtotal()
    const shipping = 0 // Mock free shipping
    const insurance = 0 // Mock free insurance
    const serviceFee = 5000
    const total = subtotal + shipping + insurance + serviceFee

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Keranjang Anda kosong</h1>
                <p className="text-gray-400 mb-8">Tambahkan beberapa produk ke keranjang Anda sebelum checkout.</p>
                <Link to="/shop" className="inline-flex items-center gap-2 text-primary hover:underline font-bold">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Katalog
                </Link>
            </div>
        )
    }

    const handlePayment = () => {
        const orderId = `SC-${Math.floor(100000 + Math.random() * 900000)}`;
        addOrder({
            id: orderId,
            items: cart,
            subtotal,
            shipping,
            insurance,
            serviceFee,
            total,
            status: 'DIPROSES',
            paymentMethod: paymentMethod === 'va' ? 'Virtual Account Mandiri' : paymentMethod === 'ewallet' ? 'E-Wallet' : 'Kartu Kredit',
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) + ' WIB'
        });

        // Navigate to the order detail page
        navigate(`/shop/order/${orderId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb / Header */}
            <div className="mb-8">
                <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                    <Link to="/shop" className="hover:text-white">Katalog</Link>
                    <span>&rsaquo;</span>
                    <span className="text-white">Pembayaran</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Checkout Pembayaran Produk</h1>
                <p className="text-gray-400">Selesaikan pembayaran Anda untuk membeli perlengkapan SmashClub.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Payment Methods */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Metode Pembayaran</h2>

                        <div className="space-y-4">
                            {/* Virtual Account Option */}
                            <div
                                onClick={() => setPaymentMethod("va")}
                                className={cn(
                                    "relative border rounded-xl p-5 cursor-pointer transition-all",
                                    paymentMethod === "va"
                                        ? "bg-[#0f2226] border-primary ring-1 ring-primary"
                                        : "bg-[#0d1b1e] border-gray-700 hover:border-gray-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", paymentMethod === "va" ? "border-primary" : "border-gray-500")}>
                                        {paymentMethod === "va" && <div className="w-3 h-3 rounded-full bg-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">Transfer Bank (Virtual Account)</h3>
                                        <p className="text-sm text-gray-400">BCA, Mandiri, BNI, BRI, Permata</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-gray-700 px-2 py-1 rounded text-[10px] font-bold text-gray-300">BCA</div>
                                        <div className="bg-gray-700 px-2 py-1 rounded text-[10px] font-bold text-gray-300">BNI</div>
                                        <div className="bg-gray-700 px-2 py-1 rounded text-[10px] font-bold text-gray-300">MANDIRI</div>
                                    </div>
                                </div>
                            </div>

                            {/* E-Wallet Option */}
                            <div
                                onClick={() => setPaymentMethod("ewallet")}
                                className={cn(
                                    "relative border rounded-xl p-5 cursor-pointer transition-all",
                                    paymentMethod === "ewallet"
                                        ? "bg-[#0f2226] border-primary ring-1 ring-primary"
                                        : "bg-[#0d1b1e] border-gray-700 hover:border-gray-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", paymentMethod === "ewallet" ? "border-primary" : "border-gray-500")}>
                                        {paymentMethod === "ewallet" && <div className="w-3 h-3 rounded-full bg-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">E-Wallet & QRIS</h3>
                                        <p className="text-sm text-gray-400">GoPay, OVO, Dana, ShopeePay</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-6 h-4 bg-blue-500 rounded"></div>
                                        <div className="w-6 h-4 bg-purple-500 rounded"></div>
                                        <div className="w-6 h-4 bg-blue-400 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Credit Card Option */}
                            <div
                                onClick={() => setPaymentMethod("cc")}
                                className={cn(
                                    "relative border rounded-xl p-5 cursor-pointer transition-all",
                                    paymentMethod === "cc"
                                        ? "bg-[#0f2226] border-primary ring-1 ring-primary"
                                        : "bg-[#0d1b1e] border-gray-700 hover:border-gray-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", paymentMethod === "cc" ? "border-primary" : "border-gray-500")}>
                                        {paymentMethod === "cc" && <div className="w-3 h-3 rounded-full bg-primary" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">Kartu Kredit / Debit</h3>
                                        <p className="text-sm text-gray-400">Visa, Mastercard, JCB, American Express</p>
                                    </div>
                                    <CreditCard className="text-gray-500 w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3 p-4 bg-[#0d1b1e] rounded-lg border border-gray-800">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Transaksi Anda aman dan terenkripsi dengan standar keamanan internasional (SSL). Kami tidak menyimpan informasi kartu kredit Anda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6">Ringkasan Pesanan</h2>

                        {/* Order Items */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-gray-700 border-dashed">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                        <div className="text-xs text-gray-400 mb-1">{item.category}</div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400">{item.quantity} x {formatPrice(item.price)}</span>
                                            <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 text-sm mb-6 border-b border-gray-700 border-dashed pb-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Subtotal</span>
                                <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Estimasi Pengiriman</span>
                                <span className="font-bold text-primary">Gratis</span>
                            </div>
                            <div className="flex justify-between items-center text-primary">
                                <span>Biaya Layanan</span>
                                <span className="font-bold">Rp 5.000</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-gray-300 font-medium">Total Pembayaran</span>
                            <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-primary text-[#0a1a1a] text-center font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,214,181,0.3)]"
                        >
                            Bayar Sekarang
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}
