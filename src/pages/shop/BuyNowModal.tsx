import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, CreditCard, Shield, Loader2 } from 'lucide-react';
import { useShopStore } from '../../features/shop/shop.store';
import { useNavigate } from 'react-router-dom';
import type { ProductVariant } from '../../features/shop/shop.types';
import { cn } from '../../lib/utils';

export default function BuyNowModal() {
    const {
        isBuyNowModalOpen,
        closeBuyNowModal,
        buyNowProduct,
        buyNowStartingVariant,
        buyNowStartingQuantity,
        buyNowAPI,
        addOrder
    } = useShopStore();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("va");

    useEffect(() => {
        if (buyNowProduct) {
            setQuantity(buyNowStartingQuantity);
            setSelectedVariant(buyNowStartingVariant);
        }
    }, [buyNowProduct, buyNowStartingVariant, buyNowStartingQuantity]);

    if (!isBuyNowModalOpen || !buyNowProduct) return null;

    const price = selectedVariant ? selectedVariant.price : buyNowProduct.price;
    const subtotal = price * quantity;
    const serviceFee = 5000;
    const total = subtotal + serviceFee;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const handleConfirmPurchase = async () => {
        setIsProcessing(true);
        try {
            const variantId = selectedVariant ? selectedVariant.id : parseInt(buyNowProduct.id);
            const response = await buyNowAPI(variantId, quantity);

            if (response.message.includes('successfully')) {
                // Mock adding to local order history to mirror handlePayment behavior
                const orderId = response.order.id.toString();
                addOrder({
                    id: orderId,
                    items: [{
                        ...buyNowProduct,
                        price: price,
                        quantity: quantity,
                        image: selectedVariant ? selectedVariant.variantImgLink : buyNowProduct.image
                    }],
                    subtotal,
                    shipping: 0,
                    insurance: 0,
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

                closeBuyNowModal();
                alert("Pembelian berhasil!");
                navigate(`/shop/order/${orderId}`);
            }
        } catch (error) {
            console.error(error);
            alert("Gagal melakukan pembelian. Silakan coba lagi.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={closeBuyNowModal}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#0a1a1a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Konfirmasi Pembelian Langsung
                    </h2>
                    <button
                        onClick={closeBuyNowModal}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Product Info */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-card/20 rounded-2xl border border-gray-800 flex items-center justify-center p-4">
                            <img
                                src={selectedVariant ? selectedVariant.variantImgLink : buyNowProduct.image}
                                alt={buyNowProduct.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{buyNowProduct.name}</h3>
                            <p className="text-sm text-primary font-bold uppercase tracking-widest">{buyNowProduct.category}</p>
                            <p className="mt-2 text-2xl font-black text-white">{formatPrice(price)}</p>
                        </div>

                        {/* Variant Selector inside Modal */}
                        {buyNowProduct.variants && buyNowProduct.variants.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Pilih Varian</p>
                                <div className="flex flex-wrap gap-2">
                                    {buyNowProduct.variants.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                selectedVariant?.id === v.id
                                                    ? "bg-primary border-primary text-background"
                                                    : "bg-card/30 border-gray-800 text-gray-400 hover:border-gray-600"
                                            )}
                                        >
                                            {v.variantName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-card/10 rounded-xl border border-gray-800">
                            <span className="text-sm font-bold text-gray-400">Jumlah</span>
                            <div className="flex items-center gap-4 bg-background/50 rounded-lg p-1 border border-gray-800">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-4 text-center text-white font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment & Summary */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-6">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Metode Pembayaran</p>
                                <div className="space-y-2">
                                    {[
                                        { id: 'va', label: 'Virtual Account', sub: 'BCA, Mandiri, BNI' },
                                        { id: 'ewallet', label: 'E-Wallet', sub: 'OVO, GoPay, Dana' },
                                        { id: 'cc', label: 'Kartu Kredit', sub: 'Visa, Mastercard' }
                                    ].map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={cn(
                                                "p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3",
                                                paymentMethod === method.id
                                                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,214,181,0.1)]"
                                                    : "bg-card/20 border-gray-800 hover:border-gray-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                paymentMethod === method.id ? "border-primary" : "border-gray-600"
                                            )}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <p className={cn("text-xs font-bold", paymentMethod === method.id ? "text-white" : "text-gray-400")}>{method.label}</p>
                                                <p className="text-[10px] text-gray-500">{method.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card/20 rounded-2xl p-4 border border-gray-800 space-y-3">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Subtotal ({quantity} item)</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Biaya Layanan</span>
                                    <span>{formatPrice(serviceFee)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-800 flex justify-between items-end">
                                    <span className="text-sm font-bold text-white">Total</span>
                                    <span className="text-xl font-black text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                                <Shield className="w-4 h-4 text-primary" />
                                <p className="text-[10px] text-gray-400">Transaksi aman & terenkripsi SSL</p>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmPurchase}
                            disabled={isProcessing}
                            className="mt-6 w-full bg-primary text-background font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_30px_rgba(0,214,181,0.2)]"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Bayar Sekarang
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
