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
    techicianId: number;         // ⚠️ probable faute -> "technicianId"
    technicianName: string;
    technicianSurname: string;
};