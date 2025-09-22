import { redirect } from "react-router";
import { getUserRole } from "./jwtDecode";

type Role = "ENGINEER" | "CUSTOMERS";

export function requireRole(allowed: Role | Role[], opts?: { login?: string }) {
    return async () => {
        const token = localStorage.getItem("ac.account");
        if (!token) {
            return redirect(opts?.login ?? "/login-user-customer");
        }

        const role = getUserRole() as Role | undefined;
        const ok = Array.isArray(allowed) ? allowed.includes(role as Role) : role === allowed;
        if (!ok) return redirect("/");

        return null;
    };
}


export const requireEngineer  = requireRole("ENGINEER", { login: "/login-user-engineer" });
export const requireCustomer  = requireRole(["CUSTOMERS"], { login: "/login-user-customer" });
