import axios from "axios";
import type { MakeDto, ModelDto, YearDto } from "../types/car";

const BASE = "http://localhost:8080";

export const fetchMakes = () =>
    axios.get<MakeDto[]>(`${BASE}/api/car/mark`).then(r => r.data);

export const fetchModels = (make: string) =>
    axios.get<ModelDto[]>(`${BASE}/api/car/model`, { params: { make } }).then(r => r.data);

export const fetchYears = (make: string, model: string) =>
    axios.get<YearDto[]>(`${BASE}/api/car/year`, { params: { make, model } }).then(r => r.data);
