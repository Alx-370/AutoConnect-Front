import axios from "axios";
import type { PrestationItem as Prestation } from "../types/prestation-item.ts";


const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

export async function fetchServices(): Promise<Prestation[]> {
    const { data } = await axios.get<Prestation[]>(`${API_BASE}/services`);
    return data;
}
