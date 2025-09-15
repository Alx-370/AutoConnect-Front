import axios from "axios";
import type { MakeDto, ModelDto, YearDto } from "../types/car";

const API_BASE= import.meta.env.VITE_API_BASE;
const BASE_ENDPOINT_CAR = import.meta.env.VITE_BASE_ENDPOINT_CAR;

const BASE_URL = `${API_BASE}${BASE_ENDPOINT_CAR}`;

export async function fetchMakes(): Promise<MakeDto[]> {
    const { data } = await axios.get<MakeDto[]>(`${BASE_URL}/mark`);
    return data;
}

export async function fetchModels(make: string): Promise<ModelDto[]> {
    const { data } = await axios.get<ModelDto[]>(`${BASE_URL}/model`, {
        params: { make },
    });
    return data;
}

export async function fetchYears(make: string, model: string): Promise<YearDto[]> {
    const { data } = await axios.get<YearDto[]>(`${BASE_URL}/year`, {
        params: { make, model },
    });
    return data;
}
