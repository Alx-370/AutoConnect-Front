
import axios from "axios";
import type {AppointmentList} from "../types/ApointmentList.ts";
import type {BaseRegister} from "../types/login.ts";

const API_BASE = "http://localhost:8080";

export async function postAxiosGarageCalendar(tokenLocal: string): Promise<AppointmentList[]> {
    const {data} = await axios.get<AppointmentList[]>(`${API_BASE}/engineers/all-Apointment-Garage`, {
        headers: {
            Authorization: `Bearer ${tokenLocal}`,
        },
    });


    return data;

}



export async function getAxiosGarageCalendarTech(tokenLocal: string): Promise<AppointmentList[]> {
    const {data} = await axios.get<AppointmentList[]>(`${API_BASE}/engineers/get-tech`, {
        headers: {
            Authorization: `Bearer ${tokenLocal}`,
        },
    });

    return data;

}

export async function putAxiosGarageCalendarSetTech(tokenLocal: string , idAppointment :number , idTech : number): Promise<BaseRegister[]> {
    const {data} = await axios.put<BaseRegister[]>(`${API_BASE}/engineers`,null, {
        params: {
            idAppointment : idAppointment,
            idTech : idTech,
        },
        headers: {
            Authorization: `Bearer ${tokenLocal}`,

        },
    });

    return data;

}