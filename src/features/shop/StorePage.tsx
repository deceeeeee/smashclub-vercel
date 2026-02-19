import { useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopStore } from './shop.store';
import type { Product, ProductCategory } from './types';

const CATEGORIES: ProductCategory[] = ['Semua Produk', 'Raket', 'Pakaian', 'Sepatu', 'Aksesori', 'Bola'];

export default function StorePage() {
    const { products, addToCart } = useShopStore();
    const [activeCategory, setActiveCategory] = useState<ProductCategory>('Semua Produk');

    const filteredProducts = activeCategory === 'Semua Produk'
        ? products
        : products.filter(p => p.category === activeCategory);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* HEADER SECTION */}
            <section className="pt-32 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Peralatan Tennis Profesional</h1>
                <p className="text-primary/80 text-lg">Temukan gear terbaik untuk meningkatkan permainan smash Anda.</p>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mt-8">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeCategory === category
                                ? 'bg-primary text-background'
                                : 'bg-card/50 text-gray-400 hover:bg-card hover:text-white border border-gray-800'
                                }`}
                        >
                            {category === 'Raket' ? 'Raket Pro' : category}
                        </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            formatPrice={formatPrice}
                            onAddToCart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* RECENT COLLECTIONS SECTION */}
            <section className="container mx-auto px-4 mt-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-white">Koleksi Terbaru</h2>
                    <button className="flex items-center text-primary font-medium hover:underline">
                        Liat Semua <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(4, 8).map((product) => (
                        <ProductCard
                            key={`recent-${product.id}`}
                            product={product}
                            formatPrice={formatPrice}
                            onAddToCart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function ProductCard({
    product,
    formatPrice,
    onAddToCart
}: {
    product: Product;
    formatPrice: (p: number) => string;
    onAddToCart: (e: React.MouseEvent) => void;
}) {
    return (
        <Link to={`/shop/${product.id}`} className="group bg-card/20 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                {product.isHot && (
                    <span className="absolute top-4 right-4 bg-red-600 text-[10px] font-black text-white px-2 py-1 rounded uppercase tracking-tighter">
                        HOT ITEM
                    </span>
                )}
                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-primary text-[10px] font-black text-background px-2 py-1 rounded uppercase tracking-tighter">
                        BARU
                    </span>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">
                    {product.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-xl font-bold text-white mt-auto py-2">
                    {formatPrice(product.price)}
                </p>

                <button
                    onClick={onAddToCart}
                    className="w-full mt-4 bg-primary text-background font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                    <ShoppingBag className="w-4 h-4 fill-current" />
                    Tambah ke Keranjang
                </button>
            </div>
        </Link>
    );
}
