import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🏸</span>
                            <span className="text-xl font-bold text-white">SmashClub</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Membangun ekosistem tennis digital terbesar di Indonesia untuk memudahkan akses dan koneksi bagi para penggemar tepok bola.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Layanan</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Booking Lapangan</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Turnamen</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Cari Pelatih</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Member Pro</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Tentang</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Karir</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Kebijakan Privasi</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-emerald-500 transition-colors">Hubungi Kami</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Kontak</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>support@smashclub.id</li>
                            <li>+62 812 3456 7890</li>
                            <li>Jakarta, Indonesia</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} SmashClub Indonesia. Seluruh Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
