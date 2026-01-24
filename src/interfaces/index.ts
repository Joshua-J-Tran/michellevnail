

export interface IUser {
    _id?: string;
    name: string;
    phonenumber: string;
    email: string;
    role: "standard" | "valued" | "vip";
    control: "user" | "owner";
    createdAt?: string;
    updatedAt?: string;
}

export interface ISalon {
    _id?: string;
    name: string;
    address: string;
    phonenumber: string;
    city: string;
    state: string;
    zip: string;
    minimumServicePrice: number;
    maximumServicePrice: number;
    workingDays: string[];
    schedule: Record<
        string,
        {
            startTime: string;
            endTime: string;
        }
    >;
    workers: Record<
        string,
        {
            name: string;
            workDay: Record<string, boolean>;
        }
    >;
    locationInMap: any;
    owner?: IUser | string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IService {
    _id?: string;
    owner?: IUser | string;
    services: Record<
        string,
        {
            name: string;
            description: string;
        }[]
    >;
    cost: number;
    isAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
}


export interface IAppointment {
    _id: string;
    salon: ISalon;
    user: IUser | string;
    owner: IUser | string;
    appointmentDate: string;
    appointmentTime: string;
    worker: IWorker | string;
    services: string[];
    status: "Pending..." | "Confirmed" | "Cancelled" | "Completed";
    createdAt?: string;
    updatedAt?: string;
    workerName?: string; // Optional field to store worker's name for convenience

}

export interface IWorker {
    _id?: string;
    name: string;
    salon: ISalon | string;
    owner: IUser | string;
    workingDays: string[];
    isActive: boolean;
    services: string[];
    createdAt?: string;
    updatedAt?: string;

}