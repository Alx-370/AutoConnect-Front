
import {getUserRole} from "./jwtDecode.ts";
import {useNavigate} from "react-router";
import type {JSX} from "react";


type Props = {
    children: JSX.Element;
    requiredRole: string;
};

export function ProtectedRoute({children, requiredRole}: Props) {
    const role = getUserRole();
    const navigate = useNavigate();

    if (!role) {
        return navigate(`/`);
    }

    if (role !== requiredRole) {

        return navigate(`/`);
    }

    return children;
}