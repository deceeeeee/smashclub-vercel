import { useQuery } from "@tanstack/react-query"
import { transactionService, type Transaction } from "./transaction.service"
import dayjs from 'dayjs'
import { Link } from "react-router-dom"
import { Search, Loader2, CreditCard, ChevronRight, ArrowLeft, Filter } from "lucide-react"
import { cn } from "../../lib/utils"

export default function TransactionListPage() {
    const { data: transactionsResponse, isLoading } = useQuery({
        queryKey: ['transaction-list'],
        queryFn: () => transactionService.getTransactionList({
            startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
            endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
            page: 0,
            size: 50
        })
    });

    const transactions = transactionsResponse?.data || [];

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 1: return { label: 'PENDING', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' };
            case 2: return { label: 'SETTLED', color: 'bg-green-500/10 border-green-500/30 text-green-400' };
            case 3: return { label: 'EXPIRED', color: 'bg-red-500/10 border-red-500/30 text-red-400' };
            case 4: return { label: 'CANCELLED', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };
            default: return { label: 'UNKNOWN', color: 'bg-gray-500/10 border-gray-500/30 text-gray-400' };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <Link to="/booking-history" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
                    </Link>
                    <h1 className="text-3xl font-black text-white">Daftar Transaksi</h1>
                    <p className="text-gray-400 mt-1">Pantau semua transaksi pembayaran Anda.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#16282a] border border-gray-800 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-[#1c3235] transition-all">
                        <Filter className="w-4 h-4 text-primary" /> Filter
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="bg-[#16282a] border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction: Transaction) => {
                        const status = getStatusInfo(transaction.status);
                        return (
                            <div key={transaction.id} className="bg-[#16282a] border border-gray-800 rounded-2xl p-6 hover:border-primary/30 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {transaction.transactionLabel || `Transaksi #${transaction.transactionCode}`}
                                                </h3>
                                                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest", status.color)}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {dayjs(transaction.createdAt).format('D MMMM YYYY, HH:mm')} • {transaction.transactionCode}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">TOTAL BAYAR</div>
                                            <div className="text-xl font-black text-white">
                                                <span className="text-xs mr-1 opacity-50 font-normal">Rp</span>
                                                {transaction.totalPrice.toLocaleString('id-ID')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {transaction.paymentLink && transaction.status === 1 && (
                                                <a
                                                    href={transaction.paymentLink}
                                                    className="bg-primary text-[#051111] px-4 py-2 rounded-lg text-xs font-black hover:bg-primary/90 transition-all"
                                                >
                                                    Bayar
                                                </a>
                                            )}
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-24 text-center bg-[#16282a] border border-gray-800 rounded-[2rem]">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Belum ada transaksi</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Semua riwayat pembayaran Anda akan muncul di sini setelah Anda melakukan pemesanan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
