import {Route, Routes} from "react-router";
import Dashboard from "../pages/B_body/Dashboard";



const Router = () => {
    return (
        <Routes>
                <Route path="/" element={<Dashboard />} />
        </Routes>
    );
};

export default  Router