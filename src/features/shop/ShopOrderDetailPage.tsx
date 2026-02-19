import { Link, useParams } from "react-router-dom"
import { Calendar, Package, ArrowLeft, Clock, MapPin, CheckCircle2, XCircle, CreditCard, ChevronRight, RotateCcw } from "lucide-react"
import { useShopStore } from "./shop.store"
import { cn } from "../../lib/utils"

export default function ShopOrderDetailPage() {
    const { id } = useParams()
    const { orderHistory } = useShopStore()

    // Find the order in history or use mock from image
    const order = orderHistory.find(o => o.id === id)

    const mockOrder = {
        id: id || "SC-982341",
        date: "24 Okt 2023, 14:20 WIB",
        status: "DIPROSES" as const,
        items: [
            {
                id: '1',
                name: 'Yonex Astrox 88D Pro',
                variant: 'Varian: 4U/G5 - Camel Gold',
                price: 2500000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop'
            },
            {
                id: '2',
                name: 'Lining Saga II Professional',
                variant: 'Ukuran: 42 EU - Red/White',
                price: 1450000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop'
            }
        ],
        subtotal: 3950000,
        shipping: 25000,
        insurance: 5000,
        serviceFee: 1000,
        total: 3981000,
        paymentMethod: 'Virtual Account Mandiri'
    }

    const currentOrder = order ? {
        ...order,
        variant: 'Standard', // Store doesn't have variants yet, using fallback
        insurance: order.insurance || 0,
        shipping: order.shipping || 0
    } : mockOrder;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const statusBadgeStyles = {
        'MENUNGGU PEMBAYARAN': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
        'DIPROSES': 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        'SIAP DIAMBIL': 'bg-primary/10 border-primary/30 text-primary',
        'SELESAI': 'bg-green-500/10 border-green-500/30 text-green-500',
        'DIBATALKAN': 'bg-red-500/10 border-red-500/30 text-red-500'
    }

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-8 text-gray-500">
                    <Link to="/profile" className="hover:text-white transition-colors">Informasi Pengguna</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/shop/orders" className="hover:text-white transition-colors">Pesanan Saya</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary">Konfirmasi Pembayaran</span>
                </div>

                <div className="w-full">
                    {/* Status Banner */}
                    {currentOrder.status === 'DIBATALKAN' ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-10 mb-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-500/20 rounded-full blur-[100px]"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                                    <XCircle className="w-10 h-10 text-[#051111]" />
                                </div>
                                <h1 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">PESANAN <span className="text-red-500">DIBATALKAN</span></h1>
                                <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                                    Pesanan <span className="text-white">#{currentOrder.id}</span> telah dibatalkan. Dana (jika sudah terbayar) akan dikembalikan sesuai kebijakan refund kami.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-10 mb-10 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,214,181,0.4)] transition-transform duration-500 hover:scale-110">
                                    <CheckCircle2 className="w-10 h-10 text-[#051111]" />
                                </div>
                                <h1 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">PEMBAYARAN <span className="text-primary">BERHASIL!</span></h1>
                                <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                                    Pesanan <span className="text-white">#{currentOrder.id}</span> telah kami terima. Kami sedang menyiapkan perlengkapan SmashClub Anda untuk segera siap diambil.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                                    <Calendar className="w-4 h-4" /> {currentOrder.date}
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase",
                                    statusBadgeStyles[currentOrder.status as keyof typeof statusBadgeStyles]
                                )}>
                                    {currentOrder.status}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to={`/shop/order/${currentOrder.id}/cancel`}
                                className={cn(
                                    "px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all text-xs font-black flex items-center gap-2",
                                    currentOrder.status === 'DIBATALKAN' && "opacity-50 pointer-events-none"
                                )}
                            >
                                <XCircle className="w-4 h-4" /> Batalkan Pesanan
                            </Link>
                            <Link
                                to={`/shop/order/${currentOrder.id}/refund`}
                                className="px-6 py-3 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/5 transition-all text-xs font-black flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Ajukan Refund
                            </Link>
                            <Link to="/shop" className="px-8 py-3 rounded-xl bg-primary text-[#051111] hover:bg-primary/90 transition-all text-xs font-black flex items-center gap-2 shadow-[0_0_20px_rgba(0,214,181,0.3)] font-sans">
                                Beli Produk Lain
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Item Pesanan */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Item Pesanan ({currentOrder.items.length})</h2>
                            </div>

                            <div className="space-y-6">
                                {currentOrder.items.map((item: any, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center p-3 group-hover:border-primary/30 transition-colors">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                                                <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 font-medium">{item.variant || (item as any).category}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-400">Jumlah: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Informasi Pengambilan */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Informasi Pengambilan (Self Pick-up)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-4">LOKASI PENGAMBILAN</h4>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-1" />
                                        <div>
                                            <p className="font-bold text-lg mb-1">Venue Court</p>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">SmashClub Arena, Jl. Raya Menteng No. 12, Jakarta Pusat</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-4">ESTIMASI PENGAMBILAN</h4>
                                    <p className="font-bold text-lg mb-1">25 - 26 Okt 2023</p>
                                    <p className="text-sm text-gray-500 font-medium mb-6 text-emerald-400">Pukul 10:00 - 20:00 WIB</p>

                                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-4">INSTRUKSI PENGAMBILAN</h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Tunjukkan bukti pembayaran saat melakukan pengambilan di lokasi.",
                                            "Bawa identitas diri (KTP/SIM) yang sesuai dengan nama pemesan.",
                                            "Pengambilan dilakukan pada jam operasional toko yang tertera."
                                        ].map((text, idx) => (
                                            <li key={idx} className="flex gap-3 text-xs text-gray-400 font-medium leading-relaxed">
                                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8 sticky top-24 shadow-2xl">
                            <h2 className="text-xl font-bold mb-8">Ringkasan Pembayaran</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Total Harga ({currentOrder.items.length} barang)</span>
                                    <span className="text-white font-bold">{formatPrice(currentOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Ongkos Kirim</span>
                                    <span className="text-white font-bold">{formatPrice(currentOrder.shipping)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Asuransi Pengiriman</span>
                                    <span className="text-white font-bold">{formatPrice(currentOrder.insurance)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Biaya Layanan</span>
                                    <span className="text-white font-bold">{formatPrice(currentOrder.serviceFee)}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-between items-end mb-10">
                                <span className="text-lg font-bold">Total Pembayaran</span>
                                <span className="text-3xl font-black text-primary">{formatPrice(currentOrder.total)}</span>
                            </div>

                            <Link to="/shop/orders" className="w-full bg-primary text-[#051111] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,214,181,0.2)] mb-8">
                                <Package className="w-5 h-5" /> Lihat Riwayat Pesanan
                            </Link>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-gray-500 tracking-[0.1em] uppercase mb-0.5">METODE PEMBAYARAN</p>
                                        <p className="text-xs font-bold">{currentOrder.paymentMethod}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-bold flex items-center justify-center gap-2 hover:text-white cursor-help transition-colors">
                                    <CheckCircle2 className="w-4 h-4" /> Butuh bantuan dengan pesanan ini?
                                </p>
                            </div>
                        </div>

                        {/* Back to Catalog */}
                        <Link to="/shop" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all py-4">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog SmashClub
                        </Link>
                    </div>
                </div>

                {/* Status Pesanan Timeline */}
                <div className="mt-12 bg-[#0a1a1a] border border-white/5 rounded-3xl p-10">
                    <h2 className="text-2xl font-bold mb-10">Status Pesanan</h2>

                    <div className="space-y-0">
                        {/* Timeline Item 1 */}
                        <div className="relative pl-12 pb-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <CheckCircle2 className="w-5 h-5 text-[#051111]" />
                            </div>
                            <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-white/10" />
                            <div>
                                <h4 className="text-xl font-bold mb-1">Pesanan Dibuat</h4>
                                <p className="text-xs text-gray-500 mb-3 font-bold">{currentOrder.date}</p>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-xl font-medium">Menunggu konfirmasi pembayaran dari sistem perbankan. Harap selesaikan pembayaran sebelum batas waktu berakhir.</p>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="relative pl-12 pb-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white/10 bg-[#0a1a1a] flex items-center justify-center z-10">
                                <Clock className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-white/5" />
                            <div>
                                <h4 className="text-xl font-bold mb-1 text-gray-500">Pembayaran Diterima</h4>
                                <p className="text-xs text-gray-600 mb-3 font-bold">Belum diproses</p>
                            </div>
                        </div>

                        {/* Timeline Item 3 (Last) */}
                        <div className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-white/10 bg-[#0a1a1a] flex items-center justify-center z-10">
                                <Package className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-1 text-gray-500">Pesanan Siap Diambil</h4>
                                <p className="text-xs text-gray-600 mb-1 font-bold">Belum tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="border-t border-white/5 py-10 mt-20 opacity-40">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 text-[10px] font-black tracking-widest uppercase">
                        <Link to="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
                        <Link to="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
                        <Link to="/help" className="hover:text-primary transition-colors">Pusat Bantuan</Link>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500">&copy; 2026 SmashClub Indonesia. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
