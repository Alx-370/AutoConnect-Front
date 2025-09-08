import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import BookingSteps from "../../components/BookingSteps.tsx";
import {Box, Typography} from "@mui/material";
import QuoteCard from "../../components/QuoteCard.tsx";
import BookingCalendar from "../../components/BookingCalendar.tsx";


const SearchAppointmentGarage= () => {
    return (
        <>
        <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700,padding: 5, marginTop: 1, display: "flex", justifyContent: "center" }}>
                    AutoConnect
                </Typography>
            <BookingSteps activeStep={2} />
            </Box>
            <Box sx={{display: "flex", flexDirection: "raw", justifyContent: "space-around"}}>
            <QuoteCard />
            <BookingCalendar />
            </Box>
        <Footer />
        </>
    )
}

export default SearchAppointmentGarage;