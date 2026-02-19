import { api } from "../../lib/axios"

export interface RegisterRequest {
    fullName: string
    email: string
    password: string
}

export interface RegisterResponse {
    success: boolean
    message?: string
    data?: {
        id: string
        fullName: string
        email: string
        createdAt: string
    }
    error?: string
    details?: Record<string, string>
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    success: boolean
    message?: string
    data?: {
        userId: string
        fullName?: string
        email: string
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
        requiresOtp?: boolean
        otpExpiresIn?: number
    }
    error?: string
}

export interface VerifyOTPResponse {
    success: boolean
    message?: string
    data?: {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
        user_id: string
        email: string
        full_name: string
    }
    error?: string
}

export interface LogoutResponse {
    success: boolean
    message?: string
    data?: string
    status?: number
    timestamp?: string
    error?: string
}

export interface ProfileResponse {
    status: string
    message?: string
    success: boolean
    data?: {
        id: number
        name: string
        fullName?: string
        email: string
        role: string
        createdAt: string
        pendingEmail?: string
    }
}

export interface UpdateProfileRequest {
    fullName: string
    email?: string
}

export interface UpdateProfileResponse {
    status: string
    message: string
    success: boolean
    data?: {
        id: number
        fullName: string
        email: string
        role: string
    }
}

export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface ChangePasswordResponse {
    status: string
    message: string
    success: boolean
}

export const authService = {
    getProfile: async (): Promise<ProfileResponse> => {
        try {
            const response = await api.get<ProfileResponse>("/profile")
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        try {
            const response = await api.put<UpdateProfileResponse>("/profile", data)
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    verifyEmailChange: async (token: string): Promise<any> => {
        try {
            const response = await api.post("/profile/verify-email-change", { token })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        try {
            const response = await api.post<ChangePasswordResponse>("/profile/change-password", data)
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    cancelEmailChange: async (): Promise<any> => {
        try {
            const response = await api.post("/cancel-email-change")
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>("/auth/login", data)
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await api.post<RegisterResponse>("/auth/register", data)
            return response.data
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data
            }
            throw error
        }
    },

    getVerificationToken: async (email: string): Promise<any> => {
        try {
            const response = await api.get(`/auth/test/get-verification-token`, {
                params: { email }
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    verifyEmail: async (token: string): Promise<any> => {
        try {
            const response = await api.get(`/auth/verify-email`, {
                params: { token }
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    resendVerification: async (email: string): Promise<any> => {
        try {
            const params = new URLSearchParams()
            params.append('email', email)
            const response = await api.post(`/auth/resend-verification`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    checkSession: async (): Promise<any> => {
        try {
            const response = await api.get("/auth/check-session")
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    refreshToken: async (refreshToken: string): Promise<any> => {
        try {
            const response = await api.post("/auth/refresh-token", { refreshToken })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    logout: async (refreshToken: string): Promise<LogoutResponse> => {
        try {
            const params = new URLSearchParams()
            params.append('refreshToken', refreshToken)
            const response = await api.post<LogoutResponse>("/auth/logout", params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    forgotPassword: async (email: string): Promise<any> => {
        try {
            const response = await api.post("/auth/forgot-password", { email })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    validateResetToken: async (token: string): Promise<any> => {
        try {
            const response = await api.get("/auth/validate-reset-token", {
                params: { token }
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    resetPassword: async (token: string, newPassword: string): Promise<any> => {
        try {
            const response = await api.post("/auth/reset-password", {
                token,
                newPassword
            })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    verifyOTP: async (userId: string, otp: string): Promise<VerifyOTPResponse> => {
        try {
            const response = await api.post<VerifyOTPResponse>("/auth/verify-otp", { userId, otp })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    },

    resendOTP: async (userId: string): Promise<any> => {
        try {
            const response = await api.post("/auth/resend-otp", { userId })
            return response.data
        } catch (error: any) {
            if (error.response?.data) return error.response.data
            throw error
        }
    }
}
