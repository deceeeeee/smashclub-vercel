import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    UserPlus,
    Package,
    ArrowRight,
    Info,
    X,
    Plus,
    Minus,
    Check,
    ChevronRight,
    CalendarDays
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBookingStore, type Coach, type Equipment } from './booking.store';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from './booking.service';

dayjs.locale('id');

interface TimeSlot {
    time: string;
    status: 'available' | 'booked' | 'selected';
}

const generateTimeSlots = (selectedDate: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = dayjs();
    const isToday = dayjs(selectedDate).isSame(now, 'day');
    const currentHour = now.hour();

    for (let hour = 6; hour <= 23; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        let status: 'available' | 'booked' | 'selected' = 'available';

        if (isToday && hour <= currentHour) {
            status = 'booked';
        } else {
            // Randomly mock some booked slots for future times/other days
            // In a real app, this would come from an API
            const hash = (dayjs(selectedDate).unix() + hour) % 10;
            if (hash === 3 || hash === 7) status = 'booked';
        }

        slots.push({ time, status });
    }
    return slots;
};

// Dynamic dates for the horizontal picker (next 14 days)
const getHorizontalDates = () => {
    return Array.from({ length: 14 }, (_, i) => {
        const d = dayjs().add(i, 'day');
        return {
            day: d.format('ddd').toUpperCase(),
            date: d.format('D'),
            fullDate: d.format('YYYY-MM-DD')
        };
    });
};

const MOCK_COACHES: Coach[] = [
    { id: '1', name: 'Andri Setiawan', specialization: 'Spesialis Pemula', price: 150000, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop' },
    { id: '2', name: 'Maya Putri', specialization: 'Teknik Forehand & Backhand', price: 175000, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    { id: '3', name: 'Budi Santoso', specialization: 'Latihan Fisik & Kelincahan', price: 125000, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
];

const MOCK_EQUIPMENT: Equipment[] = [
    { id: '1', name: 'Raket Tennis Premium', price: 50000, unit: 'sesi', quantity: 0, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop' },
    { id: '2', name: 'Bola Tennis (1 Kaleng)', price: 25000, unit: 'kaleng', quantity: 0, image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2072&auto=format&fit=crop' },
];

export default function BookingSchedulePage() {
    const { courtId } = useParams();
    const navigate = useNavigate();

    // Store integration
    const {
        selectedDate,
        selectedSlots,
        selectedCoach,
        selectedEquipments,
        setSelectedDate,
        setSelectedSlots,
        setSelectedCoach,
        setSelectedEquipments,
        setCourtId
    } = useBookingStore();

    const [slots, setSlots] = useState<TimeSlot[]>(() =>
        generateTimeSlots(selectedDate).map(slot => ({
            ...slot,
            status: selectedSlots.includes(slot.time) ? 'selected' : slot.status
        }))
    );

    // Queries
    const { data: courtsResponse } = useQuery({
        queryKey: ['courts'],
        queryFn: bookingService.getAllCourts
    });

    const currentCourt = courtsResponse?.data?.find(c => c.id.toString() === courtId);

    const { data: availabilityResponse, isLoading: isLoadingAvailability } = useQuery({
        queryKey: ['availability', selectedDate, courtId],
        queryFn: () => bookingService.checkAllCourtsAvailability(selectedDate),
        enabled: !!selectedDate
    });

    const courtAvailability = availabilityResponse?.data?.find(c => c.id.toString() === courtId);

    // Update local slots when availability changes
    useEffect(() => {
        if (courtAvailability) {
            const apiSlots: TimeSlot[] = courtAvailability.availableSlots.map(slot => ({
                time: slot.startTime.substring(0, 5), // "08:00:00" -> "08:00"
                status: slot.available ? 'available' : 'booked'
            }));

            setSlots(apiSlots.map(slot => ({
                ...slot,
                status: selectedSlots.includes(slot.time) ? 'selected' : slot.status
            })));
        } else if (!isLoadingAvailability) {
            // Fallback to empty or mock if API fails/no data
            setSlots([]);
        }
    }, [courtAvailability, selectedSlots, isLoadingAvailability]);

    // Set court ID on mount
    useEffect(() => {
        if (courtId) setCourtId(courtId);
    }, [courtId, setCourtId]);

    const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    // Temp state for modals
    const [tempCoach, setTempCoach] = useState<Coach | null>(selectedCoach);
    const [tempEquipments, setTempEquipments] = useState<Equipment[]>(MOCK_EQUIPMENT);

    const horizontalDates = getHorizontalDates();

    const toggleSlot = (time: string) => {
        const slot = slots.find(s => s.time === time);
        if (!slot || slot.status === 'booked') return;

        let newSelectedSlots;
        if (selectedSlots.includes(time)) {
            newSelectedSlots = selectedSlots.filter(s => s !== time);
        } else {
            newSelectedSlots = [...selectedSlots, time].sort();
        }
        setSelectedSlots(newSelectedSlots);
    };

    const handleAddCoach = () => {
        setSelectedCoach(tempCoach);
        setIsCoachModalOpen(false);
    };

    const handleAddEquipment = () => {
        setSelectedEquipments(tempEquipments.filter(e => e.quantity > 0));
        setIsEquipmentModalOpen(false);
    };

    const updateTempEquipmentQuantity = (id: string, delta: number) => {
        setTempEquipments(prev => prev.map(e => {
            if (e.id === id) {
                return { ...e, quantity: Math.max(0, e.quantity + delta) };
            }
            return e;
        }));
    };

    const selectedSlotsCount = selectedSlots.length;

    const pricePerHour = currentCourt?.pricePerHour || 150000;
    const courtPrice = selectedSlotsCount * pricePerHour;
    const coachPrice = selectedCoach ? (selectedCoach.price * selectedSlotsCount) : 0;
    const equipmentPrice = selectedEquipments.reduce((sum, e) => sum + (e.price * e.quantity), 0);
    const totalPrice = courtPrice + coachPrice + equipmentPrice;

    return (
        <div className="bg-background min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4">
                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/booking')}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{currentCourt?.courtName || 'Loading...'}</h1>
                        <p className="text-sm text-gray-500">Jakarta Selatan • {currentCourt?.courtCode || 'Court'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: SELECTION */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Date Selection */}
                        <section className="bg-card/20 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h2>Pilih Tanggal</h2>
                                </div>
                                <button
                                    onClick={() => setIsCalendarModalOpen(true)}
                                    className="flex items-center gap-2 bg-[#16282a] border border-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white hover:border-gray-600 transition-all uppercase tracking-wider"
                                >
                                    <CalendarDays className="w-3.5 h-3.5 text-primary" />
                                    Pilih Bulan
                                </button>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {horizontalDates.map((d) => (
                                    <button
                                        key={d.fullDate}
                                        onClick={() => setSelectedDate(d.fullDate)}
                                        className={cn(
                                            "flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all border",
                                            selectedDate === d.fullDate
                                                ? "bg-primary border-primary text-background shadow-[0_0_20px_rgba(0,214,181,0.3)]"
                                                : "bg-[#16282a] border-gray-800 text-gray-400 hover:border-gray-600"
                                        )}
                                    >
                                        <span className="text-[10px] font-bold uppercase mb-1">{d.day}</span>
                                        <span className="text-2xl font-black">{d.date}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Time Slots */}
                        <section className="bg-card/20 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <h2>Slot Waktu Tersedia</h2>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <div className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                                        <span>Tersedia</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                                        <span>Terisi</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        <span>Pilihan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {isLoadingAvailability ? (
                                    <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                                        Memuat slot waktu...
                                    </div>
                                ) : slots.length > 0 ? (
                                    slots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            disabled={slot.status === 'booked'}
                                            onClick={() => toggleSlot(slot.time)}
                                            className={cn(
                                                "h-16 rounded-xl border flex flex-col items-center justify-center transition-all",
                                                selectedSlots.includes(slot.time)
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : slot.status === 'booked'
                                                        ? "border-gray-800 bg-gray-900/50 text-gray-700 cursor-not-allowed"
                                                        : "border-gray-800 hover:border-gray-600 text-gray-400"
                                            )}
                                        >
                                            <span className="text-lg font-black">{slot.time}</span>
                                            <span className="text-[9px] uppercase font-bold">
                                                {slot.status === 'booked' ? 'Terisi' : selectedSlots.includes(slot.time) ? 'Pilihan' : 'Tersedia'}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                                        Tidak ada slot tersedia untuk tanggal ini.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#16282a] border border-gray-800 rounded-3xl p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-8">Ringkasan Pilihan</h2>

                            <div className="space-y-6 mb-8">
                                <SummaryItem
                                    icon={<Calendar className="w-5 h-5 text-primary" />}
                                    label="TANGGAL"
                                    value={dayjs(selectedDate).format('dddd, D MMMM YYYY')}
                                />
                                <SummaryItem
                                    icon={<Clock className="w-5 h-5 text-primary" />}
                                    label="SLOT WAKTU"
                                    value={selectedSlotsCount > 0 ? `${selectedSlots.join(', ')} (${selectedSlotsCount} Jam)` : '-'}
                                />
                                <SummaryItem
                                    icon={<MapPin className="w-5 h-5 text-primary" />}
                                    label="LAPANGAN"
                                    value={currentCourt?.courtName || '-'}
                                />
                                <SummaryItem
                                    icon={<UserPlus className="w-5 h-5 text-primary" />}
                                    label="PELATIH"
                                    value={selectedCoach ? selectedCoach.name : '-'}
                                />
                                <SummaryItem
                                    icon={<Package className="w-5 h-5 text-primary" />}
                                    label="PERALATAN"
                                    value={selectedEquipments.length > 0 ? selectedEquipments.map(e => `${e.quantity}x ${e.name.split(' ')[0]}`).join(', ') : '-'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => {
                                        setTempCoach(selectedCoach);
                                        setIsCoachModalOpen(true);
                                    }}
                                    className="flex flex-col items-center justify-center p-4 bg-card/20 border border-gray-800 rounded-2xl hover:bg-card/40 transition-all group"
                                >
                                    <UserPlus className="w-6 h-6 text-gray-400 mb-2 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Tambah Pelatih</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setTempEquipments(MOCK_EQUIPMENT.map(me => {
                                            const selected = selectedEquipments.find(se => se.id === me.id);
                                            return selected ? { ...selected } : { ...me, quantity: 0 };
                                        }));
                                        setIsEquipmentModalOpen(true)
                                    }}
                                    className="flex flex-col items-center justify-center p-4 bg-card/20 border border-gray-800 rounded-2xl hover:bg-card/40 transition-all group"
                                >
                                    <Package className="w-6 h-6 text-gray-400 mb-2 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Tambah Peralatan</span>
                                </button>
                            </div>

                            <div className="mb-8">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">TOTAL HARGA</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-primary">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    <span className="text-[10px] text-gray-500 font-medium mb-1.5">*Termasuk pelatih & alat</span>
                                </div>
                            </div>

                            <Link
                                to={`/booking/checkout/${courtId}`}
                                className="w-full flex items-center justify-center gap-3 bg-primary text-background font-black py-4 px-8 rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                            >
                                Metode Pembayaran
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Info Section */}
                        <div className="mt-6 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-4">
                            <Info className="w-6 h-6 text-blue-400 shrink-0" />
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Informasi Penting</h4>
                                <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                                    <li>Pembatalan minimal 12 jam sebelumnya.</li>
                                    <li>Wajib menggunakan sepatu tennis.</li>
                                    <li>Harap datang 15 menit lebih awal.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COACH MODAL */}
            {isCoachModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCoachModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#16282a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h3 className="text-xl font-bold text-white">Pilih Pelatih</h3>
                            <button onClick={() => setIsCoachModalOpen(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {MOCK_COACHES.map((coach) => (
                                <div
                                    key={coach.id}
                                    onClick={() => setTempCoach(coach)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all",
                                        tempCoach?.id === coach.id
                                            ? "bg-primary/5 border-primary ring-1 ring-primary"
                                            : "bg-card/20 border-gray-800 hover:border-gray-700"
                                    )}
                                >
                                    <div className="relative">
                                        <img src={coach.image} alt={coach.name} className="w-14 h-14 rounded-xl object-cover" />
                                        {tempCoach?.id === coach.id && (
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-background rounded-full p-0.5 border-2 border-[#16282a]">
                                                <Check className="w-3 h-3 font-bold" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{coach.name}</h4>
                                        <p className="text-xs text-gray-500 mb-1">{coach.specialization}</p>
                                        <span className="text-primary text-sm font-bold">+ Rp {coach.price.toLocaleString('id-ID')} / Jam</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-0">
                            <button
                                onClick={handleAddCoach}
                                className="w-full bg-primary text-background font-black py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                Tambah Pelatih
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EQUIPMENT MODAL */}
            {isEquipmentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEquipmentModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#16282a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-bold text-white">Sewa Peralatan</h3>
                            </div>
                            <button onClick={() => setIsEquipmentModalOpen(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {tempEquipments.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card/20 border border-gray-800">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                        <p className="text-primary text-xs font-bold">Rp {item.price.toLocaleString('id-ID')} <span className="text-gray-500 font-medium">/{item.unit}</span></p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-card/30 rounded-lg p-1 border border-gray-800">
                                        <button
                                            onClick={() => updateTempEquipmentQuantity(item.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-4 text-center font-bold text-white text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateTempEquipmentQuantity(item.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-0 border-t border-gray-800/50 mt-4">
                            <div className="flex justify-between items-center py-4 mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TOTAL BIAYA SEWA</span>
                                <span className="text-xl font-black text-primary">
                                    Rp {tempEquipments.reduce((sum, e) => sum + (e.price * e.quantity), 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <button
                                onClick={handleAddEquipment}
                                className="w-full bg-primary text-background font-black py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                Tambah Peralatan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CALENDAR MODAL */}
            <CalendarModal
                isOpen={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
            />
        </div>
    );
}

function CalendarModal({
    isOpen,
    onClose,
    selectedDate,
    onSelectDate
}: {
    isOpen: boolean,
    onClose: () => void,
    selectedDate: string,
    onSelectDate: (date: string) => void
}) {
    const [viewDate, setViewDate] = useState(dayjs(selectedDate));

    useEffect(() => {
        if (isOpen) {
            setViewDate(dayjs(selectedDate));
        }
    }, [isOpen, selectedDate]);

    const startOfMonth = viewDate.startOf('month');
    const daysInMonth = viewDate.daysInMonth();

    // Calculate empty slots for the start of the month (Monday based)
    const startDay = startOfMonth.day(); // 0 is Sunday, 1 is Monday
    const emptySlots = startDay === 0 ? 6 : startDay - 1;

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(viewDate.date(i));
    }

    const prevMonth = () => setViewDate(viewDate.subtract(1, 'month'));
    const nextMonth = () => setViewDate(viewDate.add(1, 'month'));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#16282a] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-base font-bold text-white min-w-[140px] text-center capitalize">
                            {viewDate.format('MMMM YYYY')}
                        </h3>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-gray-500 uppercase py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: emptySlots }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-10" />
                        ))}
                        {days.map((day) => {
                            const dateStr = day.format('YYYY-MM-DD');
                            const isSelected = dateStr === selectedDate;
                            const isToday = dateStr === dayjs().format('YYYY-MM-DD');
                            const isPast = day.isBefore(dayjs().startOf('day'));

                            return (
                                <button
                                    key={dateStr}
                                    disabled={isPast}
                                    onClick={() => {
                                        onSelectDate(dateStr);
                                        onClose();
                                    }}
                                    className={cn(
                                        "h-10 rounded-xl text-sm font-bold transition-all relative group",
                                        isSelected
                                            ? "bg-primary text-background shadow-[0_0_15px_rgba(0,214,181,0.3)]"
                                            : isToday
                                                ? "bg-primary/10 text-primary border border-primary/30"
                                                : isPast
                                                    ? "text-gray-700 cursor-not-allowed"
                                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    {day.date()}
                                    {!isSelected && isToday && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-800/30">
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Pilihan</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                            <div className="w-2 h-2 rounded-full border border-primary" />
                            <span>Hari Ini</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0f2226] flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">{label}</span>
                <span className="text-[13px] font-bold text-white">{value}</span>
            </div>
        </div>
    );
}
