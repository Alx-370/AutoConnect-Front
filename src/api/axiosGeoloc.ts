import axios from "axios";
import type {PrestationItem} from "../types/prestationItem";
import type {Geoloc} from "../types/geoloc.ts";




const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function axiosGeoloc(payload: PrestationItem[], Coordinate: string, radiusKm : number ): Promise<Geoloc[]> {
    const {data} = await axios.post<Geoloc[]>(`${API_BASE}/garage`, payload, {
        params: {
            coordinate: Coordinate,
            radiusKm: radiusKm
        }
    });
    return data;
}