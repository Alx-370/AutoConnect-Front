import axios from "axios";
import type { MakeDto, ModelDto, YearDto } from "../types/car";

const API_BASE = "http://localhost:8080";

export async function fetchMakes(): Promise<MakeDto[]> {
    const { data } = await axios.get<MakeDto[]>(`${API_BASE}/api/car/mark`);
    return data;
}

export async function fetchModels(make: string): Promise<ModelDto[]> {
    const { data } = await axios.get<ModelDto[]>(`${API_BASE}/api/car/model`, {
        params: { make },
    });
    return data;
}

export async function fetchYears(make: string, model: string): Promise<YearDto[]> {
    const { data } = await axios.get<YearDto[]>(`${API_BASE}/api/car/year`, {
        params: { make, model },
    });
    return data;
}
