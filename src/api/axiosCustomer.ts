import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export type CarDTO = {
    id?: number;
    immat?: string;
    make?: string;
    model?: string;
    year?: number;
    km?: number;
};


export type AppointmentDTO = {
    id?: number;
    start?: string;
    end?: string;
    services?: number[];
    garageId?: number;
    garageName?: string;
    carId?: number;
    comment?: string | null;
};


type RawAppointment = {
    id?: number;
    garageId?: number | null;
    carID?: number | null;
    startDate: string;
    endDate: string;
    comment?: string | null;
    serviceId?: number | null;
};

function normalizeAppointment(a: RawAppointment): AppointmentDTO {
    return {
        id: a.id,
        start: a.startDate,
        end: a.endDate,
        services: a.serviceId != null ? [a.serviceId] : [],
        garageId: a.garageId ?? undefined,
        carId: a.carID ?? undefined,
        comment: a.comment ?? null,
    };
}

export async function getCars(token: string): Promise<CarDTO[]> {
    const { data } = await axios.get<CarDTO[]>(`${API_BASE}/car`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}

export async function getAppointments(token: string): Promise<AppointmentDTO[]> {
    const { data } = await axios.get<RawAppointment[]>(`${API_BASE}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.map(normalizeAppointment);
}
