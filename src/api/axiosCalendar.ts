import type { ApointmentDto } from "../types/apointment-dto.ts";

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchCalendar(id: number | null): Promise<ApointmentDto> {
    const {data} = await axios.get<ApointmentDto>(`${API_BASE}/garage/availability-garage`, {
        params: {
            garageId : id,
        }
    });
    return data;
}