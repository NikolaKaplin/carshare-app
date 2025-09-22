import { eq } from "drizzle-orm";
import { backups } from "@/db/schema";

import { TNewBackup, TUpdateBackup } from "../db/schema";
import { DatabaseContextType } from "tauri-react-sqlite";

const returningId = (result: any) => {
    return result.lastInsertRowid as number;
};

export const backupsService = {
    async getBackups({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allBackups = await db.select().from(backups).orderBy(backups.createdAt);
        return allBackups;
    },

    async getBackup({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const backup = await db.select().from(backups).where(eq(backups.id, id));
        return backup;
    },

    async createBackup({ db }: DatabaseContextType, backup: TNewBackup) {
        if (!db) throw new Error("Database not initialized");
        const newBackup = returningId(await db.insert(backups).values(backup));
        const [createdBackup] = await db.select().from(backups).where(eq(backups.id, newBackup));
        return createdBackup;
    },

    async updateBackup({ db }: DatabaseContextType, id: number, backup: TUpdateBackup) {
        if (!db) throw new Error("Database not initialized");
        await db.update(backups).set(backup).where(eq(backups.id, id));
        const updatedBackup = await db.select().from(backups).where(eq(backups.id, id));
        return updatedBackup;
    },

    async deleteBackup({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedBackup = await db.select().from(backups).where(eq(backups.id, id));
        await db.delete(backups).where(eq(backups.id, id));
        return deletedBackup;
    },
};