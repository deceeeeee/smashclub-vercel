import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from './types';

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
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: (open?: boolean) => void;
    addOrder: (order: ShopOrder) => void;
    cancelOrder: (orderId: string) => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
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

export const useShopStore = create<ShopState>()(
    persist(
        (set, get) => ({
            cart: [],
            isCartOpen: false,
            products: MOCK_PRODUCTS,
            orderHistory: [],
            addToCart: (product) => {
                const cart = get().cart;
                const existingItem = cart.find((item) => item.id === product.id);
                if (existingItem) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }
                set({ isCartOpen: true });
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
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
            clearCart: () => set({ cart: [] }),
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
