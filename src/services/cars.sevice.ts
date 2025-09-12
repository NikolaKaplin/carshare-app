import { cars } from "@/db/schema";
import { ICreateCar, IUpdateCar } from "@/types/cars-types";
import { eq } from "drizzle-orm";
import { DatabaseContextType, returningId } from "tauri-react-sqlite";

export const carsService = {
  async getCars({ db }: DatabaseContextType) {
    if (!db) throw new Error("Database not initialized");
    const allCars = await db.select().from(cars);
    return allCars;
  },

  async getCar({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const car = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  },

  async createCar({ db }: DatabaseContextType, car: ICreateCar) {
    if (!db) throw new Error("Database not initialized");
    const newCar = returningId(await db.insert(cars).values(car));
    const createdCar = await db.select().from(cars).where(eq(cars.id, newCar!));
    return createdCar;
  },

  async updateCar({ db }: DatabaseContextType, id: number, car: IUpdateCar) {
    if (!db) throw new Error("Database not initialized");
    await db.update(cars).set(car).where(eq(cars.id, id));
    const updatedCar = await db.select().from(cars).where(eq(cars.id, id));
    return updatedCar;
  },

  async deleteCar({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const deletedCar = await db.select().from(cars).where(eq(cars.id, id));
    await db.delete(cars).where(eq(cars.id, id));
    return deletedCar;
  },
};
