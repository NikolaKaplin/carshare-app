import { bookings } from "@/db/schema";
import { ICreateBooking, IUpdateBooking } from "@/types/bookings-types";
import { eq } from "drizzle-orm";
import { DatabaseContextType, returningId } from "tauri-react-sqlite";

export const bookingsService = {
    async getBookings({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allBookings = await db.select().from(bookings);
        return allBookings;
    },

    async getBooking({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const booking = await db.select().from(bookings).where(eq(bookings.id, id));
        return booking;
    },

    async createBooking({ db }: DatabaseContextType, booking: ICreateBooking) {
        if (!db) throw new Error("Database not initialized");
        const newBooking = returningId(await db.insert(bookings).values(booking));
        const createdBooking = await db.select().from(bookings).where(eq(bookings.id, newBooking!));
        return createdBooking;
    },

    async updateBooking({ db }: DatabaseContextType, id: number, booking: IUpdateBooking) {
        if (!db) throw new Error("Database not initialized");
        await db.update(bookings).set(booking).where(eq(bookings.id, id));
        const updatedBooking = await db.select().from(bookings).where(eq(bookings.id, id));
        return updatedBooking;
    },

    async deleteBooking({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedBooking = await db.select().from(bookings).where(eq(bookings.id, id));
        await db.delete(bookings).where(eq(bookings.id, id));
        return deletedBooking;
    },
};