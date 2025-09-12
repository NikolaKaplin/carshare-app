export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPayment {
    id: number;
    bookingId: number;
    userId: number;
    amount: number;
    status: PaymentStatus;
    transactionId?: string | null;
    cardLastDigits?: string | null;
    paymentDate?: Date | null;
    createdAt: Date;
}

export type ICreatePayment = Omit<IPayment, 'id' | 'createdAt'>;
export type IUpdatePayment = Partial<Omit<IPayment, 'id' | 'createdAt'>>;