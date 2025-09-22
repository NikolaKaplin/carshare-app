import { maintenance } from "@/db/schema";
import { ICreateMaintenance, IUpdateMaintenance } from "@/types/maintenance-types";
import { eq } from "drizzle-orm";
import { DatabaseContextType, returningId } from "tauri-react-sqlite";

export const maintenanceService = {
    async getMaintenances({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allMaintenances = await db.select().from(maintenance);
        return allMaintenances;
    },

    async getMaintenance({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const maintenanceRecord = await db.select().from(maintenance).where(eq(maintenance.id, id));
        return maintenanceRecord;
    },

    async getMaintenancesByCarId({ db }: DatabaseContextType, carId: number) {
        if (!db) throw new Error("Database not initialized");
        const carMaintenances = await db.select().from(maintenance).where(eq(maintenance.carId, carId));
        return carMaintenances;
    },

    async createMaintenance({ db }: DatabaseContextType, maintenanceData: ICreateMaintenance) {
        if (!db) throw new Error("Database not initialized");
        const newMaintenance = returningId(await db.insert(maintenance).values(maintenanceData));
        const createdMaintenance = await db.select().from(maintenance).where(eq(maintenance.id, newMaintenance!));
        return createdMaintenance;
    },

    async updateMaintenance({ db }: DatabaseContextType, id: number, maintenanceData: IUpdateMaintenance) {
        if (!db) throw new Error("Database not initialized");
        await db.update(maintenance).set(maintenanceData).where(eq(maintenance.id, id));
        const updatedMaintenance = await db.select().from(maintenance).where(eq(maintenance.id, id));
        return updatedMaintenance;
    },

    async deleteMaintenance({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedMaintenance = await db.select().from(maintenance).where(eq(maintenance.id, id));
        await db.delete(maintenance).where(eq(maintenance.id, id));
        return deletedMaintenance;
    },
};