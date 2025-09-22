import Dashboard from "../pages/B_body/Dashboard";
import SearchGarage from "../pages/B_body/SearchGarage";
import SearchAppointmentGarage from "../pages/B_body/SearchAppointmentGarage";
import LoginUser from "../pages/B_body/LoginUser";
import RegisterUser from "../pages/B_body/RegisterUser";
import GarageCalendar from "../pages/B_body/GarageCalendar";
import LoginEngineerViaHeader from "../pages/B_body/LoginEngineerViaHeader";
import RegisterEngineerViaHeader from "../pages/B_body/RegisterEngineerViaHeader";


import {createBrowserRouter, redirect} from "react-router";
import { getUserRole } from "../protectedRoute/jwtDecode";
import {getAxiosGarageCalendarTech, postAxiosGarageCalendar} from "../api/axiosGarageCalendar.ts";
import DashboardEngineer from "../pages/B_body/DashboardEngineer.tsx";
import {requireEngineer} from "../protectedRoute/authLoaders.ts";
import ManagementEngineer from "../pages/B_body/ManagementEngineer.tsx";
import ConfirmationAppointment from "../pages/B_body/ConfirmationAppointment.tsx";


const garageCalendarLoader = async () => {
    const token = localStorage.getItem("ac.account");
    if (!token) return redirect("/login-user");

    const role = getUserRole();
    if (role !== "ENGINEER") {
        console.log("role", role);
        return redirect("/");
    }

    try {
        const response = await postAxiosGarageCalendar(token);
        const techniciansRes = await getAxiosGarageCalendarTech(token);

        console.log(response);
        return {
            appointments: response,
            technicians: techniciansRes,
        };
    } catch (error : any) {
        console.error("Erreur lors du fetch du calendrier :", error);
        return {
            appointments:[],
            technicians: [],
        };
    }
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard/>
    },
    {
        path: "/search-garage",
        element: <SearchGarage/>
    },
    {
        path: "/search-appointment-garage",
        element: <SearchAppointmentGarage/>
    },
    {
        path: "/login-user",
        element: <LoginUser/>
    },
    {
        path: "/register-user",
        element: <RegisterUser/>},
    {
        path: "/login-user-engineer",
        element: <LoginEngineerViaHeader/>
    },
    {
        path: "/register-user-engineer",
        element: <RegisterEngineerViaHeader/>
    },
    {
        path: "/garage-calendar",
        element: <GarageCalendar/>,
        loader: garageCalendarLoader
    },

    { path: "/dashboard-engineer", element: <DashboardEngineer />, loader: requireEngineer },

    { path: "/management-engineer", element: <ManagementEngineer/>, loader: requireEngineer },

    { path: "/confirmation-appointment", element: <ConfirmationAppointment/>}

]);

export default router;
