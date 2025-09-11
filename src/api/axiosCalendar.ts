import type { ApointmentDto } from "../types/ApointmentDto.ts";

import axios from "axios";

const API_BASE = "http://localhost:8080";
export async function fetchCalendar(id: number | null): Promise<ApointmentDto> {
    const {data} = await axios.get<ApointmentDto>(`${API_BASE}/garage/availability-garage`, {
        params: {
            garageId : id,
        }
    });
    return data;
}