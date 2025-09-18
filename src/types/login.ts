export type Login = {
    email: string;
    token: string;
};

export type LoginFormState = {
    garageId: number;
    carId: number;
    startDate: string;
    endDate: string;
    comment: string;
    serviceId: number[];
};

export type BaseRegister = {
    email: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
};

export type DayKey =
    | "monday" | "tuesday" | "wednesday" | "thursday"
    | "friday" | "saturday" | "sunday";

export type DayHours = {
    open: boolean;
    start: string;
    end: string };

export type OpeningHours = Record<DayKey, DayHours>;

export type EngineerService = {
    serviceId: number;
    price: number;
    durationMinutes: number;
};


export type CustomerRegisterPayload = BaseRegister;


export type EngineerRegisterPayload = BaseRegister & {
    siren: string;
    openingHours: OpeningHours;
    services: EngineerService[];
};


export type RegisterPayload = CustomerRegisterPayload | EngineerRegisterPayload;
