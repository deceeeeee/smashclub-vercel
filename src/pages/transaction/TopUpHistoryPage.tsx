import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Wallet,
    ChevronLeft,
    ChevronRight,
    Filter,
    Home
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { cn } from '../../lib/utils';
import dayjs from 'dayjs';

export default function TopUpHistoryPage() {
    const navigate = useNavigate();
    const { walletBalance } = useAuthStore();

    // Mock Topup History Data
    const mockHistory = [
        {
            id: 1,
            date: '2023-10-24 14:20',
            method: 'BCA Virtual Account',
            amount: 100000,
            status: 'SELESAI',
            statusColor: 'text-[#00d6b5] bg-[#00d6b5]/10 border-[#00d6b5]/20'
        },
        {
            id: 2,
            date: '2023-10-22 09:15',
            method: "Mandiri Livin'",
            amount: 50000,
            status: 'SELESAI',
            statusColor: 'text-[#00d6b5] bg-[#00d6b5]/10 border-[#00d6b5]/20'
        },
        {
            id: 3,
            date: '2023-10-20 18:45',
            method: 'Indomaret',
            amount: 200000,
            status: 'MENUNGGU',
            statusColor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
        },
        {
            id: 4,
            date: '2023-10-18 11:30',
            method: 'Kartu Kredit',
            amount: 150000,
            status: 'GAGAL',
            statusColor: 'text-red-500 bg-red-500/10 border-red-500/20'
        }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ');
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Header */}
            <header className="border-b border-gray-800 bg-background/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-background font-black text-xl tracking-tighter">S</span>
                        </div>
                        <h1 className="text-lg font-bold">Riwayat Top-up SmashPay</h1>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Summary Cards */}
                <div className="mb-10">
                    {/* Active Balance */}
                    <div className="bg-primary rounded-2xl p-8 shadow-xl shadow-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:scale-110 transition-transform">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-background/80">Total Saldo Aktif</p>
                        <h2 className="text-4xl font-black text-[#051111]">
                            {formatCurrency(walletBalance)}
                        </h2>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-[#0b1718] border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
                        <h3 className="text-xl font-bold">Daftar Transaksi</h3>
                        <button className="flex items-center gap-2 bg-[#16282a] border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
                            <Filter className="w-4 h-4 text-primary" /> Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-800/50">
                                    <th className="px-8 py-6">Tanggal</th>
                                    <th className="px-8 py-6">Metode</th>
                                    <th className="px-8 py-6">Nominal</th>
                                    <th className="px-8 py-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30">
                                {mockHistory.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => navigate(`/top-up/history/${item.id}`)}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-gray-300">
                                                {dayjs(item.date).format('D MMM YYYY, HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-gray-400">
                                                {item.method}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-lg font-black text-white tracking-tight">
                                                {formatCurrency(item.amount)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={cn(
                                                "text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-[0.1em]",
                                                item.statusColor
                                            )}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                    <button className="p-3 bg-card border border-gray-800 rounded-xl text-gray-500 hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-primary text-background rounded-xl font-black shadow-lg shadow-primary/20">
                        1
                    </button>
                    <button className="w-12 h-12 bg-card border border-gray-800 rounded-xl font-black text-gray-400 hover:text-white transition-all">
                        2
                    </button>
                    <button className="w-12 h-12 bg-card border border-gray-800 rounded-xl font-black text-gray-400 hover:text-white transition-all">
                        3
                    </button>
                    <button className="p-3 bg-card border border-gray-800 rounded-xl text-gray-500 hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                {/* Action Footer */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-800 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary font-black tracking-widest uppercase text-xs transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Kembali ke Beranda
                    </button>
                </div>
            </main>

            <footer className="mt-20 py-10 text-center border-t border-gray-800/30">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">
                    © 2023 SmashClub App. Semua transaksi terenkripsi dan aman.
                </p>
                <div className="flex justify-center gap-6">
                    <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-4 transition-all">Syarat & Ketentuan</button>
                    <button className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-4 transition-all">Bantuan</button>
                </div>
            </footer>
        </div>
    );
}
