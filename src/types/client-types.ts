export interface IClient {
    id: number;
    username: string;
    email: string;
    role: 'client' | 'admin';
    phone: string;
    fullName: string;
    driverLicense: string | null;
    isActive: boolean;
    createdAt: Date;
}

export interface ICreateClient extends Omit<IClient, "id" | 'createdAt'> { }
export interface IUpdateClient extends Partial<Omit<IClient, "id" | 'createdAt'>> { }
export interface IDeleteCar extends IClient { }