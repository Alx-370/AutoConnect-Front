export type Login = {
    email: string;
    token: string;

}

export type LoginFormState = {
    garageId: number;
    carId: number;
    startDate: string,
    endDate: string,
    comment: string,
    serviceId: number[];

}
