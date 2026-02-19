export type ProductCategory = 'Raket' | 'Bola' | 'Pakaian' | 'Sepatu' | 'Aksesori' | 'Semua Produk';

export interface Product {
    id: string;
    name: string;
    category: ProductCategory;
    price: number;
    image: string;
    images?: string[];
    description?: string;
    fullDescription?: string;
    isHot?: boolean;
    isNew?: boolean;
    gripSizes?: string[];
    sizes?: string[];
    specifications?: Record<string, string>;
}

export interface CartItem extends Product {
    quantity: number;
}
