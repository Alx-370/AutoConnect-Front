import {Box} from "@mui/material";
import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import MapGarage from "../../components/MapGage.tsx";
import "leaflet/dist/leaflet.css";
import BookingSteps from "../../components/BookingSteps.tsx";



const SearchGarage = () => {
    return (
        <>
            <Header/>
            <BookingSteps />
            <Box sx={{display: "flex", width: "100%", height: "85vh"}}>
              <Box sx={{ width: "150%"}}>
              </Box>
                    <MapGarage/>
            </Box>
            <Footer/>
        </>
    );
};

export default SearchGarage;
