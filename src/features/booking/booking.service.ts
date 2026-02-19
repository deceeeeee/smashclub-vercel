import { api } from '../../lib/axios';

export interface Court {
    id: number;
    courtCode: string;
    courtName: string;
    courtImgLink: string | null;
    openTime: string;
    closeTime: string;
    pricePerHour: number;
    status: number;
}

export interface AvailableSlot {
    startTime: string;
    endTime: string;
    available: boolean;
    price: number;
    status: string;
}

export interface CourtAvailability extends Court {
    availableSlots: AvailableSlot[];
}

export interface BookingResponse<T> {
    data: T;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export const bookingService = {
    getAllCourts: async (): Promise<BookingResponse<Court[]>> => {
        const response = await api.post('/booking/courts');
        return response.data;
    },

    checkAllCourtsAvailability: async (date: string): Promise<BookingResponse<CourtAvailability[]>> => {
        const response = await api.post('/booking/availability/courts', { date });
        return response.data;
    },

    checkCourtAvailability: async (date: string, courtId: number): Promise<BookingResponse<CourtAvailability[]>> => {
        const response = await api.post('/booking/availability/courts', { date, courtId });
        return response.data;
    },

    getAvailableCoaches: async (date: string, startTime: string, endTime: string): Promise<BookingResponse<any[]>> => {
        const response = await api.get('/booking/availability/coaches', {
            params: { date, startTime, endTime }
        });
        return response.data;
    }
};
