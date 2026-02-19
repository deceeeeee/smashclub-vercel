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