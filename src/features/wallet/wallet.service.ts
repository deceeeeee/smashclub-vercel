import { api } from "../../lib/axios";
import type { TopUpRequest, TopUpData, WalletResponse } from "./wallet.types";

export const walletService = {
    topUp: async (data: TopUpRequest): Promise<WalletResponse<TopUpData>> => {
        const response = await api.post("/wallet/balance/topup", data);
        return response.data;
    },
};
