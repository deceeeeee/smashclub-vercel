import { MapPin, Star, Filter, Search } from "lucide-react"
import { Link } from "react-router-dom"


const MOCK_COURTS = [
    {
        id: 1,
        name: "Emerald Tennis Center",
        type: "Indoor Hard Court",
        location: "Cilandak, Jakarta Selatan",
        rating: 4.8,
        reviews: 128,
        price: 150000,
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Senayan Tennis Court",
        type: "Outdoor Hard Court",
        location: "Senayan, Jakarta Pusat",
        rating: 4.9,
        reviews: 245,
        price: 120000,
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2072&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Green Slam Area",
        type: "Clay Court",
        location: "Kemang, Jakarta Selatan",
        rating: 4.6,
        reviews: 89,
        price: 180000,
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Executive Club",
        type: "Indoor Carpet",
        location: "Pondok Indah, Jakarta Selatan",
        rating: 5.0,
        reviews: 56,
        price: 250000,
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop" // Reuse
    }
]

export default function BookingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Cari Lapangan</h1>
                    <p className="text-gray-400">Temukan lapangan tennis terbaik di sekitar Anda</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Cari lokasi atau nama lapangan..."
                            className="bg-[#16282a] border border-gray-700 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#16282a] border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_COURTS.map(court => (
                    <div key={court.id} className="bg-[#16282a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1">
                                <Star className="w-3 h-3 text-secondary fill-secondary" />
                                <span className="text-xs font-bold text-white">{court.rating}</span>
                                <span className="text-[10px] text-gray-400">({court.reviews})</span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{court.type}</div>
                            <h3 className="font-bold text-white text-lg mb-1">{court.name}</h3>
                            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                                <MapPin className="w-4 h-4" />
                                {court.location}
                            </div>

                            <div className="border-t border-gray-700/50 pt-4 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-gray-400">Mulai dari</div>
                                    <div className="font-bold text-white">Rp {court.price.toLocaleString("id-ID")}<span className="text-xs font-normal text-gray-500">/jam</span></div>
                                </div>
                                <Link to={`/booking/checkout/${court.id}`} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-[#0a1a1a] rounded-lg text-sm font-bold transition-all">
                                    Book
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
