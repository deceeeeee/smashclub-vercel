import { Link } from "react-router-dom"
import { Calendar, ChevronRight, RefreshCw, Search, ChevronLeft } from "lucide-react"
import { useBookingStore } from "./booking.store"
import { cn } from "../../lib/utils"

export default function BookingHistoryPage() {
    const { bookingHistory } = useBookingStore()

    const statusStyles = {
        'SELESAI': 'bg-green-500/10 border-green-500/30 text-green-400',
        'MENUNGGU BAYAR': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        'DIBATALKAN': 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4">
                <Link to="/" className="text-gray-500 hover:text-white transition-colors">BERANDA</Link>
                <span className="text-gray-700">/</span>
                <span className="text-primary">RIWAYAT BOOKING</span>
            </div>

            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Riwayat Booking</h1>
                <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                    Pantau jadwal main dan status pembayaran pesanan Anda secara real-time.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#0a1a1a] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Table Header - Desktop Only */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="col-span-4 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">DETAIL LAPANGAN</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TANGGAL & WAKTU</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">TOTAL HARGA</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">STATUS</div>
                    <div className="col-span-2 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase text-right px-4">AKSI</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {bookingHistory.length > 0 ? (
                        bookingHistory.map((booking) => (
                            <div key={booking.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-8 py-8 hover:bg-white/[0.01] transition-all group">
                                {/* Detail Lapangan */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 border border-white/5 flex-shrink-0 group-hover:border-primary/30 transition-colors">
                                        <img src={booking.image} alt={booking.courtName} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{booking.courtName}</h3>
                                        <p className="text-sm text-gray-500">{booking.courtType}</p>
                                    </div>
                                </div>

                                {/* Tanggal & Waktu */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="text-sm font-bold text-gray-200 mb-1">{booking.date}</div>
                                    <div className="text-xs text-gray-500 font-medium">{booking.timeRange}</div>
                                </div>

                                {/* Total Harga */}
                                <div className="col-span-1 md:col-span-2 font-sans font-bold text-xl text-white">
                                    <span className="text-xs mr-1 opacity-50 font-normal">Rp</span>
                                    {booking.totalPrice.toLocaleString('id-ID')}
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className={cn(
                                        "inline-flex px-3 py-1 rounded-full text-[9px] font-black border tracking-widest",
                                        statusStyles[booking.status]
                                    )}>
                                        {booking.status}
                                    </div>
                                </div>

                                {/* Aksi */}
                                <div className="col-span-1 md:col-span-2 flex flex-col md:items-end gap-3 px-0 md:px-4">
                                    {booking.status === 'SELESAI' && (
                                        <Link to="/booking" className="bg-primary text-[#051111] px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.2)]">
                                            <Calendar className="w-4 h-4" /> Booking Lagi
                                        </Link>
                                    )}
                                    {booking.status === 'MENUNGGU BAYAR' && (
                                        <Link to={`/booking/checkout/1`} className="bg-primary text-[#051111] px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.2)]">
                                            Bayar Sekarang
                                        </Link>
                                    )}
                                    {booking.status === 'DIBATALKAN' && (
                                        <button className="text-gray-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                            Re-book <RefreshCw className="w-3 h-3" />
                                        </button>
                                    )}
                                    <Link to={`/orders/${booking.id}`} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-all">
                                        Lihat Detail <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Belum ada riwayat booking</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                                Mulai petualangan tennis Anda dengan memesan lapangan hari ini!
                            </p>
                            <Link to="/booking" className="inline-flex bg-primary text-[#051111] px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(34,197,94,0.3)]">
                                Pesan Lapangan Sekarang
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination Placeholder */}
                {bookingHistory.length > 0 && (
                    <div className="px-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                        <p className="text-xs text-gray-500 font-bold tracking-tight">
                            Menampilkan <span className="text-gray-300">1 - {bookingHistory.length}</span> dari <span className="text-gray-300">{bookingHistory.length}</span> pesanan
                        </p>
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-[#051111] font-black text-xs border border-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                1
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all text-xs font-bold">
                                2
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all text-xs font-bold">
                                3
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
