import type {Geoloc} from "../types/geoloc.ts";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export async function axiosGarageCalendar(payload: number[], Coordinate: string, radiusKm: number): Promise<Geoloc[]> {
    const {data} = await axios.post<Geoloc[]>(`${API_BASE}/garage`, payload, {
        params: {
            Coordinate: Coordinate,
            radiusKm: radiusKm
        }
    });

    return data;

}