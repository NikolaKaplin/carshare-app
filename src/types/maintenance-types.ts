export interface IMaintenance {
    id: number;
    carId: number;
    description: string;
    cost: number;
    date: Date;
    mileage: number;
    createdAt: Date;
}

export type ICreateMaintenance = Omit<IMaintenance, 'id' | 'createdAt'>;
export type IUpdateMaintenance = Partial<Omit<IMaintenance, 'id' | 'createdAt'>>;