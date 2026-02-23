import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingService } from "./booking.service"
import { transactionService } from "./transaction.service"
import dayjs from 'dayjs'
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { Calendar, Clock, Download, CheckCircle, ExternalLink, User, MapPin, ArrowLeft, XCircle, RefreshCcw, Loader2, CreditCard, Wallet } from "lucide-react"
import { cn } from "../../lib/utils";

export default function BookingDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate();
    const location = useLocation();

    const isSuccessFromCheckout = id === "success";
    const bookingCodeFromState = location.state?.bookingCode;

    const { data: bookingResponse, isLoading, error } = useQuery({
        queryKey: ['booking-detail', id],
        queryFn: () => bookingService.getBookingDetails(id!),
        enabled: !!id && !isSuccessFromCheckout
    });

    const booking = bookingResponse?.data;
    const bookingCode = booking?.bookingCode || id;

    const { data: transactionResponse } = useQuery({
        queryKey: ['transaction-detail', bookingCode],
        queryFn: () => transactionService.getTransactionDetail(bookingCode!),
        enabled: !!booking && (booking.status === 'PENDING' || booking.status === 'MENUNGGU BAYAR')
    });

    const transaction = transactionResponse?.data;

    if (isSuccessFromCheckout) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4">Pemesanan Berhasil!</h1>
                <p className="text-gray-400 text-lg mb-2 max-w-md mx-auto">
                    Terima kasih! Pesanan Anda telah diterima dan sedang diproses.
                </p>
                {bookingCodeFromState && (
                    <p className="text-primary font-bold mb-12">ID Pesanan: #{bookingCodeFromState}</p>
                )}
                {!bookingCodeFromState && (
                    <p className="text-gray-500 mb-12 italic">Silakan cek riwayat pesanan untuk detail selengkapnya.</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/transactions" className="bg-primary text-[#051111] px-8 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Lihat Riwayat Transaksi
                    </Link>
                    <Link to="/booking" className="bg-[#16282a] text-white border border-gray-800 px-8 py-4 rounded-2xl font-black hover:bg-[#1c3235] transition-all flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Booking Lagi
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !booking || !bookingResponse?.success) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4">Booking Tidak Ditemukan</h1>
                <p className="text-gray-400 mb-8">Maaf, kami tidak dapat menemukan detail pesanan dengan kode tersebut.</p>
                <Link to="/booking-history" className="text-primary font-bold hover:underline">Kembali ke Riwayat</Link>
            </div>
        );
    }



    const queryClient = useQueryClient();

    const startMutation = useMutation({
        mutationFn: () => bookingService.startBooking(booking.bookingCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-detail', id] });
            alert("Sesi booking telah dimulai!");
        },
        onError: (err: any) => alert(err?.response?.data?.message || "Gagal memulai sesi")
    });

    const completeMutation = useMutation({
        mutationFn: () => bookingService.completeBooking(booking.bookingCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-detail', id] });
            alert("Sesi booking telah selesai!");
        },
        onError: (err: any) => alert(err?.response?.data?.message || "Gagal menyelesaikan sesi")
    });

    const confirmMutation = useMutation({
        mutationFn: () => bookingService.updateBookingStatus(booking.bookingCode, 2),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-detail', id] });
            alert("Pesanan berhasil dikonfirmasi!");
        },
        onError: (err: any) => alert(err?.response?.data?.message || "Gagal mengonfirmasi pesanan")
    });

    const statusMapping: Record<string, { label: string, color: string }> = {
        'COMPLETED': { label: 'SELESAI', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
        'SELESAI': { label: 'SELESAI', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
        'PENDING': { label: 'MENUNGGU BAYAR', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
        'MENUNGGU BAYAR': { label: 'MENUNGGU BAYAR', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
        'CONFIRMED': { label: 'DIKONFIRMASI', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
        'DIKONFIRMASI': { label: 'DIKONFIRMASI', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
        'ONGOING': { label: 'SEDANG BERJALAN', color: 'bg-primary/10 border-primary/30 text-primary' },
        'SEDANG BERJALAN': { label: 'SEDANG BERJALAN', color: 'bg-primary/10 border-primary/30 text-primary' },
        'CANCELLED': { label: 'DIBATALKAN', color: 'bg-red-500/10 border-red-500/30 text-red-400' },
        'DIBATALKAN': { label: 'DIBATALKAN', color: 'bg-red-500/10 border-red-500/30 text-red-400' }
    };

    const status = statusMapping[booking.status] || { label: booking.status, color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6">
                <div className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                    <button onClick={() => navigate(-1)} className="hover:text-white flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                    <div className="flex-1" />
                    <span>Riwayat</span>
                    <span>&rsaquo;</span>
                    <span className="text-white">Detail Pesanan</span>
                </div>

                {/* Header Info */}
                <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Detail Riwayat Pesanan</h1>
                        <p className="text-gray-400 text-sm">ID Pesanan: #{booking.bookingCode}</p>
                    </div>
                    <div className="text-right">
                        <div className={cn(
                            "inline-flex items-center px-3 py-1 text-xs font-bold rounded-full mb-2 border",
                            status.color
                        )}>
                            {status.label}
                        </div>
                        <div className="text-xs text-gray-500">Dipesan pada {dayjs(booking.createdAt).format('D MMM YYYY, HH:mm')}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details - Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Court Info */}
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                            <MapPin className="w-5 h-5" />
                            <h2>Informasi Lapangan</h2>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-20 h-20 bg-teal-800/20 rounded-lg flex items-center justify-center border border-teal-800/30 flex-shrink-0">
                                <img src={booking.courtImgLink || "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"} alt={booking.courtName} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{booking.courtName}</h3>
                                <p className="text-gray-400 text-sm mb-3">{booking.courtCode}</p>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 bg-[#0d1b1e] px-4 py-2 rounded-lg border border-gray-700">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-gray-200">{dayjs(booking.bookingDate).format('D MMMM YYYY')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#0d1b1e] px-4 py-2 rounded-lg border border-gray-700">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-gray-200">{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addons */}
                    {(booking.coaches.length > 0 || booking.equipments.length > 0) && (
                        <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                                <div className="w-5 h-5 flex items-center justify-center border border-primary text-xs rounded">+</div>
                                <h2>Layanan Tambahan</h2>
                            </div>

                            <div className="space-y-3">
                                {booking.coaches.map((coach, idx) => (
                                    <div key={`coach-${idx}`} className="flex items-center gap-4 bg-[#0d1b1e] p-4 rounded-xl border border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-teal-900/30 flex items-center justify-center text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white text-sm">Pelatih ({coach.coachName})</div>
                                            <div className="text-xs text-gray-500">{coach.durationHours} Jam Sesi Latihan</div>
                                        </div>
                                        <div className="font-bold text-white">Rp {coach.coachPrice.toLocaleString('id-ID')}</div>
                                    </div>
                                ))}

                                {booking.equipments.map((item, idx) => (
                                    <div key={`eq-${idx}`} className="flex items-center gap-4 bg-[#0d1b1e] p-4 rounded-xl border border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-teal-900/30 flex items-center justify-center text-primary">
                                            <div className="w-5 h-5 flex items-center justify-center">E</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white text-sm">{item.equipmentName} ({item.quantity} unit)</div>
                                            <div className="text-xs text-gray-500">Pilihan Peralatan</div>
                                        </div>
                                        <div className="font-bold text-white">Rp {(item.equipmentPrice * item.quantity).toLocaleString('id-ID')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment Details */}
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Metode Pembayaran</h2>
                        <div className="bg-[#0d1b1e] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white px-2 py-1 rounded text-black font-bold text-xs">{booking.paymentMethod.split(' ')[0]}</div>
                                <div>
                                    <div className="text-sm font-bold text-white">{booking.paymentMethod}</div>
                                    <div className="text-xs text-gray-500">Status: {booking.paymentStatus}</div>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-sm font-medium",
                                booking.paymentStatus === 'SETTLED' ? "text-primary" : "text-gray-500"
                            )}>
                                <CheckCircle className="w-4 h-4" />
                                {booking.paymentStatus === 'SETTLED' ? 'Terbayar' : booking.paymentStatus}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary - Right */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6">Ringkasan Pembayaran</h2>

                        <div className="space-y-3 text-sm mb-6 border-b border-gray-700 border-dashed pb-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Sewa Lapangan</span>
                                <span className="font-bold text-white">Rp {booking.courtPrice.toLocaleString('id-ID')}</span>
                            </div>
                            {booking.coaches.length > 0 && (
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Pelatih</span>
                                    <span className="font-bold text-white">Rp {booking.coachPrice.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {booking.equipments.length > 0 && (
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Sewa Alat</span>
                                    <span className="font-bold text-white">Rp {booking.equipmentPrice.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {/* Biaya layanan removed */}
                        </div>

                        <div className="text-center mb-0">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">TOTAL PEMBAYARAN</div>
                            <div className="text-3xl font-bold text-primary">Rp {booking.totalPrice.toLocaleString('id-ID')}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Status Based Actions */}
                        {booking.status === 'CONFIRMED' && (
                            <button
                                onClick={() => startMutation.mutate()}
                                disabled={startMutation.isPending}
                                className="w-full py-3 bg-primary text-[#0a1a1a] font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {startMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                                Mulai Bermain
                            </button>
                        )}

                        {booking.status === 'ONGOING' && (
                            <button
                                onClick={() => completeMutation.mutate()}
                                disabled={completeMutation.isPending}
                                className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {completeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Selesaikan Sesi
                            </button>
                        )}

                        {(booking.status === 'PENDING' || booking.status === 'MENUNGGU BAYAR') && (
                            <div className="space-y-3">
                                {transaction?.paymentLink ? (
                                    <a
                                        href={transaction.paymentLink}
                                        className="w-full py-3 bg-primary text-[#0a1a1a] font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Wallet className="w-4 h-4" />
                                        Bayar Sekarang
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => confirmMutation.mutate()}
                                        disabled={confirmMutation.isPending}
                                        className="w-full py-3 bg-primary text-[#0a1a1a] font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {confirmMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                        Konfirmasi Pembayaran
                                    </button>
                                )}
                            </div>
                        )}

                        <Link to="/booking" className="w-full py-3 bg-[#16282a] border border-gray-700 text-white font-bold rounded-xl hover:bg-[#1c3235] transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" /> Booking Lagi
                        </Link>

                        <button className="w-full py-3 bg-[#16282a] border border-gray-700 text-white font-medium rounded-xl hover:bg-[#1c3235] transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download Invoice
                        </button>

                        {/* Order Actions */}
                        <Link
                            to={`/booking/${booking.bookingCode}/cancel`}
                            className={cn(
                                "w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border",
                                (booking.status === 'CANCELLED' || booking.status === 'DIBATALKAN')
                                    ? "bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                                    : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                            )}
                        >
                            <XCircle className="w-4 h-4" /> Batalkan Pesanan
                        </Link>

                        <button
                            onClick={() => navigate(`/booking/${booking.bookingCode}/refund`)}
                            className="w-full py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold rounded-xl hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> Ajukan Refund
                        </button>
                    </div>

                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 text-center">
                        <div className="text-sm text-gray-300 mb-2">Mengalami kendala?</div>
                        <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center justify-center gap-1">
                            Hubungi Pusat Bantuan <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
