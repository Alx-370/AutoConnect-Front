
export type ServiceDTO = { id?: number; name?: string };

export type Technician = {
    id?: number | string;
    technicianId?: number | string;
    techicianId?: number | string;
    techId?: number | string;
    engineerId?: number | string;
    userId?: number | string;
    employeeId?: number | string;
    name?: string;
    surname?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    email?: string;
};

export type AppointmentResponse = {
    id: number;
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    techicianId?: number;
    technicianName?: string;
    serviceDTOS?: ServiceDTO[];
};

export type SelectedEvent = {
    id: string;
    customerName: string;
    customerSurname: string;
    start: string;
    end: string;
    techIds: number[];
    techNames: string[];
    serviceDTOS: ServiceDTO[];
};

export type LoaderData = {
    appointments: AppointmentResponse[];
    technicians: Technician[];
};
