import { api } from '../../lib/axios';
import type { CourtAvailability, BookingResponse, Court } from './booking.types';

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
