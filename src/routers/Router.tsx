import {Route, Routes} from "react-router";
import Dashboard from "../pages/B_body/Dashboard";
import SearchGarage from "../pages/B_body/SearchGarage.tsx";
import SearchAppointmentGarage from "../pages/B_body/SearchAppointmentGarage.tsx";



const Router = () => {
    return (
        <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search-garage" element={<SearchGarage/>}/>
                <Route path="/search-appointment-garage" element={<SearchAppointmentGarage/>}/>
        </Routes>
    );
};

export default  Router