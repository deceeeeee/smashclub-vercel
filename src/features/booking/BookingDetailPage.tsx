import { Link, useParams } from "react-router-dom"
import { Calendar, Clock, Download, CheckCircle, ExternalLink, User, MapPin, ArrowLeft } from "lucide-react"

export default function BookingDetailPage() {
    const { id } = useParams()

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6">
                <div className="text-sm text-gray-400 flex items-center gap-2 mb-4">
                    <Link to="/" className="hover:text-white flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>
                    <div className="flex-1" />
                    <span>Riwayat</span>
                    <span>&rsaquo;</span>
                    <span className="text-white">Detail Pesanan</span>
                </div>

                {/* Header Info */}
                <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Detail Riwayat Pesanan</h1>
                        <p className="text-gray-400 text-sm">ID Pesanan: #SC-20231024-{id || "0892"}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-full mb-2">
                            SELESAI
                        </div>
                        <div className="text-xs text-gray-500">Dipesan pada 20 Okt 2023, 14:20</div>
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
                                {/* Mock Logo */}
                                <div className="text-center">
                                    <div className="text-xs font-bold text-primary">EMERALD</div>
                                    <div className="text-[8px] text-teal-300">TENNIS CENTER</div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Emerald Tennis Center</h3>
                                <p className="text-gray-400 text-sm mb-3">Lapangan Indoor 02</p>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 bg-[#0d1b1e] px-4 py-2 rounded-lg border border-gray-700">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-gray-200">24 Okt 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#0d1b1e] px-4 py-2 rounded-lg border border-gray-700">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm text-gray-200">19:00 - 21:00 (2 Jam)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addons */}
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                            <div className="w-5 h-5 flex items-center justify-center border border-primary text-xs rounded">+</div>
                            <h2>Layanan Tambahan</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-4 bg-[#0d1b1e] p-4 rounded-xl border border-gray-800">
                                <div className="w-10 h-10 rounded-full bg-teal-900/30 flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white text-sm">Pelatih (Coach Andi)</div>
                                    <div className="text-xs text-gray-500">Sesi Latihan Pro</div>
                                </div>
                                <div className="font-bold text-white">Rp 150.000</div>
                            </div>

                            <div className="flex items-center gap-4 bg-[#0d1b1e] p-4 rounded-xl border border-gray-800">
                                <div className="w-10 h-10 rounded-full bg-teal-900/30 flex items-center justify-center text-primary">
                                    <div className="w-5 h-5 flex items-center justify-center">R</div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white text-sm">Sewa Raket (2 unit)</div>
                                    <div className="text-xs text-gray-500">Wilson Blade v8</div>
                                </div>
                                <div className="font-bold text-white">Rp 50.000</div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-[#16282a] border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Metode Pembayaran</h2>
                        <div className="bg-[#0d1b1e] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white px-2 py-1 rounded text-black font-bold text-xs">BCA</div>
                                <div>
                                    <div className="text-sm font-bold text-white">Transfer Bank (Virtual Account)</div>
                                    <div className="text-xs text-gray-500">Bank Central Asia</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-primary text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Terbayar
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
                                <span className="w-24">Sewa Lapangan (2 Jam)</span>
                                <span className="font-bold text-white">Rp 300.000</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Pelatih (Coach Andi)</span>
                                <span className="font-bold text-white">Rp 150.000</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Sewa Alat (2 Unit)</span>
                                <span className="font-bold text-white">Rp 50.000</span>
                            </div>
                            <div className="flex justify-between items-center text-primary">
                                <span>Biaya Layanan</span>
                                <span className="font-bold">Rp 5.000</span>
                            </div>
                        </div>

                        <div className="text-center mb-0">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">TOTAL PEMBAYARAN</div>
                            <div className="text-3xl font-bold text-primary">Rp 505.000</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-3 bg-primary text-[#0a1a1a] font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" /> Booking Lagi
                        </button>
                        <button className="w-full py-3 bg-[#16282a] border border-gray-700 text-white font-medium rounded-xl hover:bg-[#1c3235] transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download Invoice
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
