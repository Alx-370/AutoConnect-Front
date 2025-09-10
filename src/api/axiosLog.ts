import axios from "axios";
import type { Login } from "../types/login.ts";

const API_BASE = "http://localhost:8080";


export async function fetchLog(email : string, password : string): Promise<Login> {
    const payload = { email, password };
    const { data } = await axios.post<Login>(`${API_BASE}/auth/login`, payload);
    return data;
}