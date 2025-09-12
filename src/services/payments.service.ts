import { payments } from "@/db/schema";
import { ICreatePayment, IUpdatePayment, PaymentStatus } from "@/types/payments-types";
import { eq } from "drizzle-orm";
import { DatabaseContextType, returningId } from "tauri-react-sqlite";

export const paymentsService = {
    async getPayments({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allPayments = await db.select().from(payments);
        return allPayments;
    },

    async getPayment({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const payment = await db.select().from(payments).where(eq(payments.id, id));
        return payment;
    },

    async getPaymentsByBookingId({ db }: DatabaseContextType, bookingId: number) {
        if (!db) throw new Error("Database not initialized");
        const bookingPayments = await db.select().from(payments).where(eq(payments.bookingId, bookingId));
        return bookingPayments;
    },

    async getPaymentsByUserId({ db }: DatabaseContextType, userId: number) {
        if (!db) throw new Error("Database not initialized");
        const userPayments = await db.select().from(payments).where(eq(payments.userId, userId));
        return userPayments;
    },

    async createPayment({ db }: DatabaseContextType, paymentData: ICreatePayment) {
        if (!db) throw new Error("Database not initialized");
        const newPayment = returningId(await db.insert(payments).values(paymentData));
        const createdPayment = await db.select().from(payments).where(eq(payments.id, newPayment!));
        return createdPayment;
    },

    async updatePayment({ db }: DatabaseContextType, id: number, paymentData: IUpdatePayment) {
        if (!db) throw new Error("Database not initialized");
        await db.update(payments).set(paymentData).where(eq(payments.id, id));
        const updatedPayment = await db.select().from(payments).where(eq(payments.id, id));
        return updatedPayment;
    },

    async deletePayment({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedPayment = await db.select().from(payments).where(eq(payments.id, id));
        await db.delete(payments).where(eq(payments.id, id));
        return deletedPayment;
    },

    async getPaymentsByStatus({ db }: DatabaseContextType, status: PaymentStatus) {
        if (!db) throw new Error("Database not initialized");
        const paymentsByStatus = await db.select().from(payments).where(eq(payments.status, status));
        return paymentsByStatus;
    },
};