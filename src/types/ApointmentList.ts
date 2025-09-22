export type ServiceDTO = {
    id: number;
};

export type AppointmentList = {
    startDate: string;
    endDate: string;
    serviceDTOS: ServiceDTO[];
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    techicianId: number;
    technicianName: string;
    technicianSurname: string;
};