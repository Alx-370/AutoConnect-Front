import {Route, Routes} from "react-router";
import Dashboard from "../pages/B_body/Dashboard";
import SearchGarage from "../pages/B_body/SearchGarage.tsx";
import SearchAppointmentGarage from "../pages/B_body/SearchAppointmentGarage.tsx";
import LoginUser from "../pages/B_body/LoginUser.tsx";
import RegisterUser from "../pages/B_body/RegisterUser.tsx";
import GarageCalendar from "../pages/B_body/GarageCalendar.tsx";
import LoginEngineerViaHeader from "../pages/B_body/LoginEngineerViaHeader.tsx";
import RegisterEngineerViaHeader from "../pages/B_body/RegisterEngineerViaHeader.tsx";



const Router = () => {
    return (
        <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search-garage" element={<SearchGarage/>}/>
                <Route path="/search-appointment-garage" element={<SearchAppointmentGarage/>}/>
                <Route path="/login-user" element={<LoginUser/>}/>
                <Route path="/register-user" element={<RegisterUser/>}/>
                <Route path="/login-user-engineer" element={<LoginEngineerViaHeader/>}/>
                <Route path="/register-user-engineer" element={<RegisterEngineerViaHeader/>}/>
                <Route path="/garage-calendar" element={<GarageCalendar/>}/>
        </Routes>
    );
};

export default  Router