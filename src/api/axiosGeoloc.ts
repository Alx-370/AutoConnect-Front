import axios from "axios";

import type {Geoloc} from "../types/geoloc.ts";
import type {YearDto} from "../types/car.ts";




const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function axiosGeoloc(payload: number[], Coordinate: string, radiusKm : number ): Promise<Geoloc[]> {
    const {data} = await axios.post<Geoloc[]>(`${API_BASE}/garage`, payload, {
        params: {
            Coordinate: Coordinate,
            radiusKm: radiusKm
        }
    });

    return data;

}


export async function axiosGeolocWithGPS(payload: number[], latitude: number, longitude: number, radiusKm: number): Promise<Geoloc[]> {
    const {data} = await axios.post<Geoloc[]>(`${API_BASE}/garage/gps`, payload, {
        params: {
            latitude: latitude,
            longitude: longitude,
            radiusKm: radiusKm
        }
    });


    return data;

}

