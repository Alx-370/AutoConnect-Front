import { redirect } from "react-router";
import { getUserRole } from "./jwtDecode";


export function requireRole(expected: "ENGINEER" | "CUSTOMER") {
    return async () => {
        const token = localStorage.getItem("ac.account");
        if (!token) {

            return redirect(expected === "ENGINEER" ? "/login-user-engineer" : "/login-user");
        }
        const role = getUserRole();
        if (role !== expected) {
            return redirect("/");
        }
        return null;
    };
}


export const requireEngineer = requireRole("ENGINEER");
