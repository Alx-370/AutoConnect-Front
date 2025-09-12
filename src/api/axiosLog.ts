import axios from "axios";
import type { Login } from "../types/login.ts";

const API_BASE = import.meta.env.VITE_API_BASE;


export async function fetchLog(email : string, password : string): Promise<Login> {
    const payload = { email, password };
    const { data } = await axios.post<Login>(`${API_BASE}/auth/login`, payload);
    return data;
}


export async function postAppointment(tokenLocal: string, id:number, startDate: string, endDate: string, services: number[], carId: number): Promise<Login> {
    console.log(services);
    const payload = { garageId: id, carID: carId, startDate: startDate, endDate: endDate, serviceId: services };
    const { data } = await axios.post<Login>(`${API_BASE}/appointements`, payload, {
        headers: {
            Authorization: `Bearer ${tokenLocal}`,
        },
    });
    return data
}

