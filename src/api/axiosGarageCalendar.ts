import type {Geoloc} from "../types/geoloc.ts";
import axios from "axios";
import type {AppointmentList} from "../types/ApointmentList.ts";

const API_BASE = "http://localhost:8080";

export async function postAxiosGarageCalendar(tokenLocal: string): Promise<AppointmentList[]> {
    const {data} = await axios.get<AppointmentList[]>(`${API_BASE}/engineers/all-Apointment-Garage`, {
        headers: {
            Authorization: `Bearer ${tokenLocal}`,
        },
    });

    return data;

}