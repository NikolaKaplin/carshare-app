import { eq } from "drizzle-orm";
import { hijacking } from "../db/schema";

import { TNewHijacking, TUpdateHijacking } from "../db/schema";
import { DatabaseContextType } from "tauri-react-sqlite";

const returningId = (result: any) => {
    return result.lastInsertRowid as number;
};

export const hijackingService = {
    async getHijackings({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allHijackings = await db.select().from(hijacking).orderBy(hijacking.createdAt);
        return allHijackings;
    },

    async getHijacking({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const hijackingRecord = await db.select().from(hijacking).where(eq(hijacking.id, id));
        return hijackingRecord;
    },

    async createHijacking({ db }: DatabaseContextType, hijackingData: TNewHijacking) {
        if (!db) throw new Error("Database not initialized");
        const newHijacking = returningId(await db.insert(hijacking).values(hijackingData));
        const createdHijacking = await db.select().from(hijacking).where(eq(hijacking.id, newHijacking!));
        return createdHijacking;
    },

    async updateHijacking({ db }: DatabaseContextType, id: number, hijackingData: TUpdateHijacking) {
        if (!db) throw new Error("Database not initialized");
        await db.update(hijacking).set(hijackingData).where(eq(hijacking.id, id));
        const updatedHijacking = await db.select().from(hijacking).where(eq(hijacking.id, id));
        return updatedHijacking;
    },

    async deleteHijacking({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedHijacking = await db.select().from(hijacking).where(eq(hijacking.id, id));
        await db.delete(hijacking).where(eq(hijacking.id, id));
        return deletedHijacking;
    },
};