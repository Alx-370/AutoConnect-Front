import axios from "axios";
import type { MakeDto, ModelDto, YearDto } from "../types/car";

const API_BASE = "http://localhost:8080";
const BASE_END_POINT = "api/car";

export async function fetchMakes(): Promise<MakeDto[]> {
    const { data } = await axios.get<MakeDto[]>(`${API_BASE}/${BASE_END_POINT}/mark`);
    return data;
}

export async function fetchModels(make: string): Promise<ModelDto[]> {
    const { data } = await axios.get<ModelDto[]>(`${API_BASE}/${BASE_END_POINT}/model`, {
        params: { make },
    });
    return data;
}

export async function fetchYears(make: string, model: string): Promise<YearDto[]> {
    const { data } = await axios.get<YearDto[]>(`${API_BASE}/${BASE_END_POINT}/year`, {
        params: { make, model },
    });
    return data;
}
