export interface WalletResponse<T> {
    path: string;
    data: T;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface TopUpRequest {
    amount: number;
}

export interface TopUpData {
    transactionCode: string;
    paymentData: {
        invoiceUrl: string;
    };
}
