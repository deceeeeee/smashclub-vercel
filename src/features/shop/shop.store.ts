import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, ProductAPI, ProductVariant } from './shop.types';
import { shopService } from './shop.service';
import { useAuthStore } from '../auth/auth.store';

export interface ShopOrder {
    id: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    insurance: number;
    serviceFee: number;
    total: number;
    status: 'MENUNGGU PEMBAYARAN' | 'DIPROSES' | 'SIAP DIAMBIL' | 'SELESAI' | 'DIBATALKAN';
    paymentMethod: string;
    date: string;
}

interface ShopState {
    cart: CartItem[];
    isCartOpen: boolean;
    products: Product[];
    orderHistory: ShopOrder[];
    isLoading: boolean;
    error: string | null;
    buyNowProduct: Product | null;
    buyNowStartingVariant: ProductVariant | null;
    buyNowStartingQuantity: number;
    isBuyNowModalOpen: boolean;
    addToCartProduct: Product | null;
    addToCartStartingVariant: ProductVariant | null;
    addToCartStartingQuantity: number;
    isAddToCartModalOpen: boolean;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number) => void;
    addToCartAPI: (variantId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => void;
    removeFromCartAPI: (cartItemId: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => void;
    updateQuantityAPI: (cartItemId: number, quantity: number) => Promise<void>;
    clearCart: () => void;
    clearCartAPI: () => Promise<void>;
    toggleCart: (open?: boolean) => void;
    addOrder: (order: ShopOrder) => void;
    cancelOrder: (orderId: string) => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    buyNowAPI: (variantId: number, quantity: number) => Promise<any>;
    openBuyNowModal: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    closeBuyNowModal: () => void;
    openAddToCartModal: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    closeAddToCartModal: () => void;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Pro Staff V14',
        category: 'Raket',
        price: 3500000,
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560012057-4372e14c5085?q=80&w=1974&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1617083281297-af33e89640bb?q=80&w=2070&auto=format&fit=crop'
        ],
        isHot: true,
        description: 'Didesain untuk pemain yang mengutamakan kontrol dan presisi. Pro Staff V14 membawa warisan klasik dengan sentuhan modern.',
        fullDescription: 'Didesain untuk pemain yang mengutamakan kontrol dan presisi. Pro Staff V14 membawa warisan klasik dengan sentuhan modern. Teknologi Braid 45 memberikan stabilitas yang luar biasa di setiap pukulan, memberikan rasa solid yang menjadi ciri khas seri legendaris ini.',
        gripSizes: ['L2', 'L3', 'L4'],
        specifications: {
            'Weight (Unstrung)': '315 g / 11.1 oz',
            'Balance': '31 cm / 10 pts HL',
            'String Pattern': '16 x 19'
        }
    },
    {
        id: '2',
        name: 'Babolat Pure Aero',
        category: 'Raket',
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1617083281297-af33e89640bb?q=80&w=2070&auto=format&fit=crop',
        gripSizes: ['L1', 'L2', 'L3'],
        specifications: {
            'Weight (Unstrung)': '300 g / 10.6 oz',
            'Balance': '32 cm / 7 pts HL',
            'String Pattern': '16 x 19'
        }
    },
    {
        id: '3',
        name: 'Slazenger 4pc',
        category: 'Bola',
        price: 150000,
        image: 'https://unsplash.com/photos/a-tennis-ball-on-a-table-hH_wY-p0X0k',
        specifications: {
            'Weight': '30 g',
            'Diameter': '5.2 cm',
            'Number of Balls': '4'
        }
    },
    {
        id: '4',
        name: 'Nike Court Air',
        category: 'Sepatu',
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop',
        sizes: ['39', '40', '41', '42', '43', '44'],
        specifications: {
            'Weight': '305 g / 10.8 oz',
        }
    },
    {
        id: '5',
        name: 'Yonex VCORE 98',
        category: 'Raket',
        price: 3100000,
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop',
        gripSizes: ['L2', 'L3'],
        specifications: {
            'Weight (Unstrung)': '305 g / 10.8 oz',
            'Balance': '31.5 cm / 9 pts HL',
            'String Pattern': '16 x 19'
        }
    },
    {
        id: '6',
        name: 'Head Gravity MP',
        category: 'Raket',
        price: 2900000,
        image: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?q=80&w=1974&auto=format&fit=crop',
        isNew: true,
        gripSizes: ['L2', 'L3'],
        specifications: {
            'Weight (Unstrung)': '295 g / 10.4 oz',
            'Balance': '32.5 cm / 5 pts HL',
            'String Pattern': '16 x 20'
        }
    },
    {
        id: '7',
        name: 'Adidas Ergo Shorts',
        category: 'Pakaian',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
        id: '9',
        name: 'Yonex Astrox 88D Pro',
        category: 'Raket',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070&auto=format&fit=crop',
        gripSizes: ['4U/G5'],
        isHot: true,
        description: 'Varian: 4U/G5 - Camel Gold'
    },
    {
        id: '10',
        name: 'Lining Saga II Professional',
        category: 'Sepatu',
        price: 1450000,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925&auto=format&fit=crop',
        sizes: ['40', '41', '42', '43'],
        description: 'Ukuran: 42 EU - Red/White'
    },
    {
        id: '8',
        name: 'Wilson Roland Garros',
        category: 'Bola',
        price: 180000,
        image: 'https://drive.google.com/file/d/1Pv5m8PSQHcF-RkgYCdqGWRxRlu_BST0R/view?usp=sharing',
        specifications: {
            'Weight': '30 g',
            'Diameter': '5.5 cm',
            'Number of Balls': '4'
        }
    },
];

const mapAPICartItems = (items: any[]): CartItem[] => {
    return items
        .map((apiItem: any, index: number) => {
            if (!apiItem) return null;

            // Item ID — backend may use id or cartItemId
            const rawId = apiItem.cartItemId ?? apiItem.id ?? apiItem.productId;
            const id = rawId != null ? rawId.toString() : `item-${index}`;

            // Variant data — prioritized from new docs structure
            const variant = apiItem.variant ?? apiItem.productVariant ?? null;
            const variantName = variant?.variantName ?? apiItem.variantName ?? null;

            // Product name extraction
            const productName =
                apiItem.productName ??
                apiItem.product?.productName ??
                variant?.product?.productName ??
                "Produk";

            const displayName = variantName && !productName.includes(variantName)
                ? `${productName} - ${variantName}`
                : productName;

            // Price: prioritize variant price from the new structure
            const price =
                apiItem.priceAtAdd ??
                variant?.price ??
                apiItem.price ??
                0;

            // Image: prioritize variant image link
            const image =
                variant?.variantImgLink ??
                apiItem.imgLink ??
                apiItem.product?.defaultImgLink ??
                variant?.product?.defaultImgLink ??
                "";

            // Category
            const category =
                apiItem.category ??
                apiItem.product?.category ??
                variant?.product?.category ??
                "Kategori";

            return {
                id,
                name: displayName,
                category,
                price,
                image,
                quantity: apiItem.quantity ?? 1,
            } as CartItem;
        })
        .filter(Boolean) as CartItem[];
};

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            cart: [],
            isCartOpen: false,
            products: MOCK_PRODUCTS,
            orderHistory: [],
            isLoading: false,
            error: null,
            buyNowProduct: null,
            buyNowStartingVariant: null,
            buyNowStartingQuantity: 1,
            isBuyNowModalOpen: false,
            addToCartProduct: null,
            addToCartStartingVariant: null,
            addToCartStartingQuantity: 1,
            isAddToCartModalOpen: false,
            fetchProducts: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getProducts();
                    if (response.success) {
                        const mappedProducts: Product[] = response.data.content.map((apiProduct: ProductAPI) => ({
                            id: apiProduct.id.toString(),
                            name: apiProduct.productName,
                            category: apiProduct.category,
                            price: apiProduct.productVariants[0]?.price || 0,
                            image: apiProduct.defaultImgLink,
                            description: apiProduct.productDesc,
                            variants: apiProduct.productVariants
                        }));
                        set({ products: mappedProducts, isLoading: false });
                    } else {
                        set({ error: response.message, isLoading: false });
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch products', isLoading: false });
                }
            },
            fetchProductById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getProductById(id);
                    if (response.success) {
                        const apiProduct = response.data;
                        const mappedProduct: Product = {
                            id: apiProduct.id.toString(),
                            name: apiProduct.productName,
                            category: apiProduct.category,
                            price: apiProduct.productVariants[0]?.price || 0,
                            image: apiProduct.defaultImgLink,
                            description: apiProduct.productDesc,
                            variants: apiProduct.productVariants
                        };

                        set((state) => ({
                            products: state.products.some(p => p.id === mappedProduct.id)
                                ? state.products.map(p => p.id === mappedProduct.id ? mappedProduct : p)
                                : [...state.products, mappedProduct],
                            isLoading: false
                        }));
                    } else {
                        set({ error: response.message, isLoading: false });
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch product', isLoading: false });
                }
            },
            fetchCart: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.getCart() as any;
                    const cartData = response?.data;
                    const items: any[] = cartData?.items ?? response?.items ?? [];

                    const isSuccess =
                        response?.success === true ||
                        response?.status === 200 ||
                        (cartData?.cartId !== undefined);

                    if (isSuccess) {
                        const mappedItems = mapAPICartItems(items);
                        set({ cart: mappedItems, isLoading: false, error: null });
                    } else if (
                        response?.status === 404 ||
                        response?.message?.toLowerCase().includes('not found') ||
                        response?.message?.toLowerCase().includes('no active cart')
                    ) {
                        set({ cart: [], isLoading: false, error: null });
                    } else {
                        set({ error: response?.message || 'Gagal memuat keranjang', isLoading: false });
                    }
                } catch (error: any) {
                    if (error?.response?.status === 404) {
                        set({ cart: [], isLoading: false, error: null });
                    } else {
                        set({ error: error.message || 'Terjadi kesalahan saat memuat keranjang', isLoading: false });
                    }
                }
            },
            addToCartAPI: async (variantId: number, quantity: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.addToCart({ variantId, quantity });
                    // Backend returns the updated cart structure in AddToCartResponse
                    if (response && response.items) {
                        const mappedItems = mapAPICartItems(response.items);
                        set({ cart: mappedItems, isLoading: false });
                    } else {
                        // Fallback: if items not returned, we might need to fetch
                        await get().fetchCart();
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Gagal menambahkan ke keranjang', isLoading: false });
                    throw error;
                }
            },
            addToCart: (product, quantity = 1) => {
                const cart = get().cart;
                const existingItem = cart.find((item) => item.id === product.id);
                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + (quantity || 1) } : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity: quantity || 1 }] });
                }
                set({ isCartOpen: true });
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },
            removeFromCartAPI: async (cartItemId: number) => {
                set({ isLoading: true, error: null });
                try {
                    await shopService.removeCartItem(cartItemId);
                    // Update local state by removing the item
                    set((state) => ({
                        cart: state.cart.filter(item => item.id !== cartItemId.toString()),
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to remove item', isLoading: false });
                }
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            updateQuantityAPI: async (cartItemId: number, quantity: number) => {
                if (quantity <= 0) {
                    await get().removeFromCartAPI(cartItemId);
                    return;
                }
                set({ isLoading: true, error: null });
                try {
                    await shopService.updateCartItem(cartItemId, quantity);
                    // Update local state quantity
                    set((state) => ({
                        cart: state.cart.map(item =>
                            item.id === cartItemId.toString() ? { ...item, quantity } : item
                        ),
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update quantity', isLoading: false });
                }
            },
            clearCart: () => set({ cart: [] }),
            clearCartAPI: async () => {
                const token = useAuthStore.getState().token;
                if (!token) {
                    set({ cart: [] });
                    return;
                }

                set({ isLoading: true, error: null });
                try {
                    await shopService.clearCart();
                    set({ cart: [], isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to clear cart', isLoading: false });
                }
            },
            toggleCart: (open) => set({ isCartOpen: open !== undefined ? open : !get().isCartOpen }),
            addOrder: (order) => set((state) => ({
                orderHistory: [order, ...state.orderHistory],
                cart: []
            })),
            cancelOrder: (orderId) => set((state) => ({
                orderHistory: state.orderHistory.map(order =>
                    order.id === orderId ? { ...order, status: 'DIBATALKAN' } : order
                )
            })),
            getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
            getSubtotal: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
            buyNowAPI: async (variantId: number, quantity: number) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await shopService.buyNow({ variantId, quantity });
                    if (response.message.includes('successfully')) {
                        // Optionally clear cart or update order history
                        // For now we just return the response
                        set({ isLoading: false });
                        return response;
                    } else {
                        set({ error: response.message, isLoading: false });
                        return response;
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to buy product', isLoading: false });
                    throw error;
                }
            },
            openBuyNowModal: (product, variant, quantity) => set({
                buyNowProduct: product,
                buyNowStartingVariant: variant || (product.variants?.[0] || null),
                buyNowStartingQuantity: quantity || 1,
                isBuyNowModalOpen: true
            }),
            closeBuyNowModal: () => set({
                buyNowProduct: null,
                buyNowStartingVariant: null,
                buyNowStartingQuantity: 1,
                isBuyNowModalOpen: false
            }),
            openAddToCartModal: (product, variant, quantity) => set({
                addToCartProduct: product,
                addToCartStartingVariant: variant || (product.variants?.[0] || null),
                addToCartStartingQuantity: quantity || 1,
                isAddToCartModalOpen: true
            }),
            closeAddToCartModal: () => set({
                addToCartProduct: null,
                addToCartStartingVariant: null,
                addToCartStartingQuantity: 1,
                isAddToCartModalOpen: false
            }),
        }),
        {
            name: 'smashclub-shop-storage',
            partialize: (state) => ({
                cart: state.cart,
                orderHistory: state.orderHistory
            }),
        }
    )
);
