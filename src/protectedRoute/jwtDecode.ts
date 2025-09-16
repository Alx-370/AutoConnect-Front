import {jwtDecode} from "jwt-decode";

type TokenPayload = {
    sub: string;
    role: string;
    exp: number;
};

export function getUserRole(): string | null {
    const token = localStorage.getItem("ac.account");
    if (!token) return null;

    const decoded: TokenPayload = jwtDecode(token);
    return decoded.role;
}