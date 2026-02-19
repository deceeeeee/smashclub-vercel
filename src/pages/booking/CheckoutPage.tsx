import { Link, useParams } from "react-router-dom"
import { Calendar, CreditCard, Shield, Clock } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { useBookingStore } from "../../features/booking/booking.store"

import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export default function CheckoutPage() {
    const { courtId } = useParams()
    const [paymentMethod, setPaymentMethod] = useState("va")

    const {
        selectedDate,
        selectedSlots,
        selectedCoach,
        selectedEquipments,
        addBookingToHistory,
        resetBooking,
    } = useBookingStore();


    const selectedSlotsCount = selectedSlots.length;
    const courtPrice = selectedSlotsCount * 150000;
    const coachPrice = selectedCoach ? (selectedCoach.price * selectedSlotsCount) : 0;
    const equipmentPrice = selectedEquipments.reduce((sum, e) => sum + (e.price * e.quantity), 0);
    const serviceFee = 5000;
    const totalPrice = courtPrice + coachPrice + equipmentPrice + serviceFee;

    const timeRange = selectedSlots.length > 0
        ? `${selectedSlots[0]} - ${`${parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0]) + 1}:00`}`
        : "-";

    const handlePayment = () => {
        addBookingToHistory({
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            courtName: "Center Court Arena",
            courtType: "Lapangan Indoor 02",
            date: dayjs(selectedDate).format('D MMM YYYY'),
            timeRange: timeRange,
            totalPrice: totalPrice,
            status: 'SELESAI',
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop",
            coachName: selectedCoach?.name,
            equipments: selectedEquipments.map(e => ({ name: e.name, quantity: e.quantity, price: e.price })),
            courtPrice: courtPrice,
            coachPrice: coachPrice,
            equipmentPrice: equipmentPrice,
            serviceFee: serviceFee
        });
        resetBooking();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb / Header */}
            <div className="mb-8">
                <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                    <Link to={`/booking/schedule/${courtId || '1'}`} className="hover:text-white">Jadwal</Link>
                    <span>&rsaquo;</span>
                    <span className="text-white">Pembayaran</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Checkout Pembayaran Tennis</h1>
                <p className="text-gray-400">Selesaikan pembayaran Anda untuk mengonfirmasi pesanan SmashClub.</p>
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

                        {/* Court Snippet */}
                        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-700 border-dashed">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                                <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop" alt="Court" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Center Court Arena</h3>
                                <div className="text-xs text-gray-400 mb-2">Lapangan Indoor 02</div>
                                <div className="flex flex-col gap-1">
                                    <div className="inline-flex items-center px-2 py-1 rounded bg-[#0f2226] border border-gray-700 text-[10px] text-primary">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {dayjs(selectedDate).format('D MMM YYYY')}
                                    </div>
                                    <div className="inline-flex items-center px-2 py-1 rounded bg-[#0f2226] border border-gray-700 text-[10px] text-primary">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {timeRange}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 text-sm mb-6 border-b border-gray-700 border-dashed pb-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Sewa Lapangan ({selectedSlotsCount} Jam)</span>
                                <span className="font-bold text-white">Rp {courtPrice.toLocaleString('id-ID')}</span>
                            </div>
                            {selectedCoach && (
                                <div className="flex justify-between items-center text-gray-300">
                                    <span>Pelatih ({selectedCoach.name})</span>
                                    <span className="font-bold text-white">Rp {coachPrice.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {selectedEquipments.map(e => (
                                <div key={e.id} className="flex justify-between items-center text-gray-300">
                                    <span>{e.name} ({e.quantity} unit)</span>
                                    <span className="font-bold text-white">Rp {(e.price * e.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center text-primary">
                                <span>Biaya Layanan</span>
                                <span className="font-bold">Rp {serviceFee.toLocaleString('id-ID')}</span>
                            </div>
                        </div>


                        {/* Total */}
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-gray-300 font-medium">Total Pembayaran</span>
                            <span className="text-3xl font-bold text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>

                        <Link
                            to="/booking/success"
                            onClick={handlePayment}
                            className="w-full block bg-primary text-[#0a1a1a] text-center font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,214,181,0.3)]"
                        >
                            Bayar Sekarang
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}
