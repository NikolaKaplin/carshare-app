import { eq } from "drizzle-orm";
import { points } from "../db/schema";

import { TNewPoint, TUpdatePoint } from "../db/schema";
import { DatabaseContextType } from "tauri-react-sqlite";

const returningId = (result: any) => {
  return result.lastInsertRowid as number;
};

export const pointsService = {
  async getPoints({ db }: DatabaseContextType) {
    if (!db) throw new Error("Database not initialized");
    const allPoints = await db.select().from(points).orderBy(points.id);
    return allPoints;
  },

  async getPoint({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const point = await db.select().from(points).where(eq(points.id, id));
    return point;
  },

  async createPoint({ db }: DatabaseContextType, point: TNewPoint) {
    if (!db) throw new Error("Database not initialized");
    const newPoint = returningId(await db.insert(points).values(point));
    const createdPoint = await db.select().from(points).where(eq(points.id, newPoint!));
    return createdPoint;
  },

  async updatePoint({ db }: DatabaseContextType, id: number, point: TUpdatePoint) {
    if (!db) throw new Error("Database not initialized");
    await db.update(points).set(point).where(eq(points.id, id));
    const updatedPoint = await db.select().from(points).where(eq(points.id, id));
    return updatedPoint;
  },

  async deletePoint({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const deletedPoint = await db.select().from(points).where(eq(points.id, id));
    await db.delete(points).where(eq(points.id, id));
    return deletedPoint;
  },
};