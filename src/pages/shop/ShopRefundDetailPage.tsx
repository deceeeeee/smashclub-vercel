import { useLocation, useParams, Link } from "react-router-dom"
import { Check, Clock, Copy, MessageSquare, ShieldCheck, FileText, Package } from "lucide-react"
import { useShopStore } from "../../features/shop/shop.store"
import { cn } from "../../lib/utils"

export default function ShopRefundDetailPage() {
    const { id } = useParams()
    const location = useLocation()
    const { orderHistory } = useShopStore()

    // Get data passed from previous page or mock it
    const locationState = location.state || {}
    const { reason, additionalInfo, refundDate } = locationState

    // Find the order in history or use mock
    const order = orderHistory.find(o => o.id === id)

    const mockOrder = {
        id: id || "SC-2023081501",
        date: "15 Agustus 2023",
        status: "DIPROSES",
        items: [
            {
                id: '1',
                name: 'Yonex Astrox 88D Pro Gen-3',
                variant: '4U/G5 - Cyan',
                price: 2450000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop'
            },
            {
                id: '2',
                name: 'Shuttlecock Tournament A1 (12 pcs)',
                variant: 'Speed 78',
                price: 125000,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop'
            }
        ],
        subtotal: 2700000,
        shipping: 45000,
        total: 2745000
    }

    const currentOrder = order ? order : mockOrder

    const refundId = `RFD-${id || '88219'}`
    const mockDate = "24 Okt 2023, 10:00 WIB"
    const displayDate = refundDate || mockDate
    const displayReason = reason || "Barang Rusak/Cacat. Raket yang diterima terdapat retakan halus pada bagian frame atas saat pertama kali dibuka dari kemasan."

    // Mock timeline status
    // "Diajukan" -> "Sedang Ditinjau" -> "Disetujui" -> "Selesai"
    const currentStep = 4 // 1: Diajukan, 2: Ditinjau, 3: Disetujui, 4: Selesai

    const steps = [
        { id: 1, label: "Diajukan", sub: "24 Okt 2023, 10:00", icon: FileText },
        { id: 2, label: "Sedang Ditinjau", sub: "Selesai Ditinjau", icon: Check },
        { id: 3, label: "Disetujui", sub: "25 Okt 2023, 09:15", icon: Clock },
        { id: 4, label: "Selesai", sub: "25 Okt 2023, 14:30", icon: ShieldCheck },
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    return (
        <div className="bg-[#051111] min-h-screen text-white font-sans overflow-x-hidden">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-8 text-gray-500">
                    <Link to="/shop/orders" className="hover:text-white transition-colors">Pesanan Saya</Link>
                    <span>&rsaquo;</span>
                    <span className="text-primary">Detail Refund</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-2">Detail Tiket Refund</h1>
                        <div className="inline-flex items-center gap-2 bg-[#0a1a1a] border border-white/10 rounded-lg px-3 py-1.5">
                            <span className="text-primary font-bold text-sm">#{refundId}</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-[#0a1a1a] border border-white/10 hover:bg-white/5 transition-all text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                        <Copy className="w-4 h-4" /> Salin ID Refund
                    </button>
                </div>

                {/* Timeline */}
                <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-10 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Clock className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 hidden md:block -z-10" />

                            {steps.map((step) => {
                                const isCompleted = step.id <= currentStep
                                const isActive = step.id === currentStep
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className="flex flex-col items-center flex-1 text-center mb-6 md:mb-0 relative group">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-500 border-2 relative z-10",
                                            isCompleted ? "bg-primary border-primary shadow-[0_0_20px_rgba(0,214,181,0.4)]" :
                                                isActive ? "bg-[#0a1a1a] border-primary text-primary shadow-[0_0_15px_rgba(0,214,181,0.2)]" :
                                                    "bg-[#0a1a1a] border-white/10 text-gray-600"
                                        )}>
                                            {isCompleted ? <Check className="w-5 h-5 text-[#051111]" /> : <Icon className={cn("w-5 h-5", isActive ? "text-primary animate-pulse" : "text-gray-600")} />}
                                        </div>
                                        <h3 className={cn(
                                            "font-bold text-sm mb-1 transition-colors",
                                            isActive || isCompleted ? "text-white" : "text-gray-500"
                                        )}>
                                            {step.label}
                                        </h3>
                                        {step.sub && (
                                            <p className={cn(
                                                "text-[10px] font-medium transition-colors",
                                                isCompleted ? "text-gray-400" : "text-gray-600"
                                            )}>{step.sub}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Info Pengajuan */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Informasi Pengajuan</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2">TANGGAL PENGAJUAN</p>
                                    <p className="font-bold text-lg">{displayDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-2">ID PESANAN ASLI</p>
                                    <Link to={`/shop/order/${currentOrder.id}`} className="font-bold text-lg text-primary hover:underline">
                                        #{currentOrder.id}
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-3">ALASAN PENGEMBALIAN</p>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                        {displayReason}
                                        {additionalInfo && (
                                            <span className="block mt-2 text-gray-400 italic">"{additionalInfo}"</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Produk (Shop Items) */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">Rincian Produk</h2>
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
                                            <p className="text-sm text-gray-500 mb-2 font-medium">{item.variant || 'Standard'}</p>
                                            <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                                                <span>{item.quantity} x {formatPrice(item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-[#0a1a1a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Copy className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold">Ringkasan Refund</h2>
                            </div>

                            <div className="space-y-4 mb-6 pb-6 border-b border-white/5 border-dashed">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Subtotal Produk</span>
                                    <span className="text-white">{formatPrice(currentOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Ongkos Kirim</span>
                                    <span className="text-white">{formatPrice(currentOrder.shipping || 0)}</span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">TOTAL PENGEMBALIAN</span>
                                <div className="flex items-end gap-1">
                                    <span className="text-primary text-sm font-bold mb-1">Rp</span>
                                    <span className="text-3xl font-black text-primary">{formatPrice(currentOrder.total).replace('Rp ', '')}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase">DIKEMBALIKAN KE:</span>
                            </div>

                            <div className="bg-[#051111] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                                <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold text-white uppercase italic tracking-tighter">GoPay</div>
                                <div>
                                    <div className="text-xs font-bold text-white">E-Wallet</div>
                                    <div className="text-[10px] text-gray-500">0812****5678 a/n John Doe</div>
                                </div>
                            </div>
                        </div>

                        {/* Help */}
                        <div className="bg-[#16282a] border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-32 h-32 text-primary" />
                            </div>

                            <h3 className="font-bold text-white mb-2 relative z-10">Butuh Bantuan?</h3>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6 relative z-10">
                                Jika Anda memiliki kendala atau pertanyaan terkait pengajuan ini, tim kami siap membantu.
                            </p>

                            <button className="w-full bg-primary text-[#051111] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 relative z-10 shadow-[0_0_20px_rgba(0,214,181,0.2)]">
                                <MessageSquare className="w-4 h-4" /> Hubungi Pusat Bantuan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
