export interface ICar {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  category: "economy" | "comfort" | "business";
  dailyPrice: number;
  isAvailable: boolean;
  currentMileage: number;
  status: "available" | "rented" | "maintenance";
  location: string;
  createdAt: Date;
}

export interface ICreateCar extends Omit<ICar, "id" | "createdAt"> { }
export interface IUpdateCar extends Omit<ICar, "id" | "createdAt"> { }
export interface IDeleteCar extends ICar { }
