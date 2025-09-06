import {Route, Routes} from "react-router";
import Dashboard from "../pages/B_body/Dashboard";
import SearchGarage from "../pages/B_body/SearchGarage.tsx";



const Router = () => {
    return (
        <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search-garage" element={<SearchGarage/>}/>
        </Routes>
    );
};

export default  Router