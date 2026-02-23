import { api } from "../../lib/axios";
import type { AddToCartResponse, CartAPIResponse, ProductResponse, ProductSearchResponse } from "./shop.types";

export const shopService = {
    getProducts: async (page = 0, size = 25): Promise<ProductSearchResponse> => {
        try {
            const response = await api.get<ProductSearchResponse>("/products/search", {
                params: { page, size }
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getProductById: async (id: string): Promise<ProductResponse> => {
        try {
            const response = await api.get<ProductResponse>(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    getCart: async (): Promise<CartAPIResponse> => {
        try {
            const response = await api.get<CartAPIResponse>("/cart");
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    },

    addToCart: async (data: { userId: string; variantId: number; quantity: number }): Promise<AddToCartResponse> => {
        try {
            const response = await api.post<AddToCartResponse>("/cart/add", data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) return error.response.data;
            throw error;
        }
    }
};
