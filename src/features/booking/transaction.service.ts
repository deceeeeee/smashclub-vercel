import { api } from '../../lib/axios';

export interface Transaction {
    id: number;
    transactionCode: string;
    transactionLabel: string;
    totalPrice: number;
    paymentLink: string;
    status: number;
    isRefunded: number;
    referenceCode: string;
    notes: string;
    transactionType: number;
    paymentMethodID: number;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionResponse<T> {
    path: string;
    data: T;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface CancelTransactionResponse {
    transactionCode: string;
    requested: boolean;
    totalPrice: number;
    referenceCode: string;
    user: {
        userId: string;
        email: string;
        fullName: string;
    };
}

export const transactionService = {
    getTransactionList: async (params: {
        startDate: string;
        endDate: string;
        page?: number;
        size?: number;
    }): Promise<TransactionResponse<Transaction[]>> => {
        const response = await api.get('/transaction', { params });
        return response.data;
    },

    getTransactionDetail: async (bookingCode: string): Promise<TransactionResponse<Transaction>> => {
        const response = await api.get(`/transaction/${bookingCode}`);
        return response.data;
    },

    cancelTransactionByReference: async (referenceCode: string): Promise<TransactionResponse<CancelTransactionResponse>> => {
        const response = await api.post(`/transaction/cancel-by-reference/${referenceCode}`);
        return response.data;
    },
};
