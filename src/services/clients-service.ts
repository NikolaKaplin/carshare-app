import { clients } from "@/db/schema";
import { ICreateClient, IUpdateClient } from "@/types/client-types";
import { eq } from "drizzle-orm";
import { DatabaseContextType, returningId } from "tauri-react-sqlite";

export const clientsService = {
    async getClients({ db }: DatabaseContextType) {
        if (!db) throw new Error("Database not initialized");
        const allCients = await db.select().from(clients);
        return allCients
    },

    async getClient({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const client = await db.select().from(clients).where(eq(clients.id, id))
        return client
    },

    async createClient({ db }: DatabaseContextType, client: ICreateClient) {
        if (!db) throw new Error("Database not initialized");
        const newClient = returningId(await db.insert(clients).values(client));
        const createdClient = await db.select().from(clients).where(eq(clients.id, newClient!))
        return createdClient;
    },

    async updateClient({ db }: DatabaseContextType, id: number, client: IUpdateClient) {
        if (!db) throw new Error("Database not initialized");
        await db.update(clients).set(client).where(eq(clients.id, id))
        const updatedClient = await db.select().from(clients).where(eq(clients.id, id))
        return updatedClient
    },

    async deleteClient({ db }: DatabaseContextType, id: number) {
        if (!db) throw new Error("Database not initialized");
        const deletedClient = await db.select().from(clients).where(eq(clients.id, id))
        await db.delete(clients).where(eq(clients.id, id))
        return deletedClient
    }
}