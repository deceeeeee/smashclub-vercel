import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, BarChart2 } from 'lucide-react';
import { useShopStore } from './shop.store';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, addToCart } = useShopStore();

    const product = products.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedGrip, setSelectedGrip] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image);
            if (product.gripSizes && product.gripSizes.length > 0) {
                setSelectedGrip(product.gripSizes[0]);
            }
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            }
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background">
                <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="text-primary hover:underline flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Kembali ke Toko
                </button>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price).replace('Rp', 'Rp ');
    };

    const handleAddToCart = () => {
        // In a real app we might pass the selected grip size or product size too
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const handleBuyNow = () => {
        // Add one item (or the current quantity) and go straight to checkout
        handleAddToCart();
        navigate('/shop/checkout');
    };

    return (
        <div className="bg-background min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumbs / Back button */}
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Toko
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* LEFT COLUMN: IMAGES */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-card/20 rounded-3xl overflow-hidden border border-gray-800 flex items-center justify-center p-8 lg:p-12 relative group">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.isHot && (
                                <span className="absolute top-6 right-6 bg-red-600 text-[10px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                    HOT ITEM
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-2xl border-2 transition-all p-2 bg-card/10 overflow-hidden ${selectedImage === img ? 'border-primary' : 'border-gray-800 hover:border-gray-600'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: INFO */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-black text-primary">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Deskripsi Produk</h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {product.fullDescription || product.description}
                                </p>
                            </div>

                            {/* Options: Size selection */}
                            {(product.gripSizes || product.sizes) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Grip Size (for Rackets) */}
                                    {product.gripSizes && product.gripSizes.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Ukuran Grip</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {product.gripSizes.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedGrip(size)}
                                                        className={`w-12 h-10 rounded-lg font-bold transition-all border ${selectedGrip === size
                                                            ? 'bg-primary border-primary text-background'
                                                            : 'bg-card/30 border-gray-800 text-gray-400 hover:border-gray-600'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Size (Shoes, Clothing) */}
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pilih Ukuran</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {product.sizes.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`min-w-[3rem] h-10 px-3 rounded-lg font-bold transition-all border ${selectedSize === size
                                                            ? 'bg-primary border-primary text-background'
                                                            : 'bg-card/30 border-gray-800 text-gray-400 hover:border-gray-600'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Jumlah</h3>
                                        <div className="flex items-center w-32 bg-card/30 rounded-lg p-1 border border-gray-800">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 text-center font-bold text-white text-lg">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-primary text-background font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                                >
                                    <ShoppingCart className="w-5 h-5 fill-current" />
                                    Tambah ke Keranjang
                                </button>
                                <button className="p-4 bg-card/30 border border-gray-800 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all group">
                                    <Heart className="w-6 h-6 group-hover:fill-current transition-colors" />
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-white text-background font-black py-4 px-8 rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                            >
                                Beli Sekarang
                            </button>

                            {/* Specifications */}
                            {product.specifications && (
                                <div className="mt-12 pt-12 border-t border-gray-800">
                                    <div className="flex items-center gap-3 mb-8">
                                        <BarChart2 className="w-6 h-6 text-primary" />
                                        <h3 className="text-xl font-bold text-white">Spesifikasi Produk</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-card/20 border border-gray-800">
                                                <span className="text-gray-400 font-medium">{key}</span>
                                                <span className="text-white font-bold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
