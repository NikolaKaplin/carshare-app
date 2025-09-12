export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface IBooking {
    id: number;
    userId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalPrice: number;
    status: BookingStatus;
    pickupLocation: string;
    paymentStatus: PaymentStatus;
    createdAt: Date;
}

export interface ICreateBooking extends Omit<IBooking, "id" | "createdAt"> { }
export interface IUpdateBooking extends Partial<Omit<IBooking, "id" | "createdAt">> { }
export interface IDeleteCar extends IBooking { }
