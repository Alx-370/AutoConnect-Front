import {Box, Typography} from "@mui/material";
import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import MapGarage from "../../components/MapGage.tsx";
import "leaflet/dist/leaflet.css";



const SearchGarage = () => {
    return (
        <>
            <Header/>
            <Box sx={{display: "flex", width: "100%", height: "85vh"}}>
              <Box sx={{ width: "50%"}}>
              </Box>
                <Box sx={{flexGrow: 1}}>
                    <MapGarage/>
                </Box>
            </Box>
            <Footer/>
        </>
    );
};

export default SearchGarage;
