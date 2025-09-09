import { useState } from "react";
import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import BookingSteps from "../../components/BookingSteps.tsx";
import {Box, Typography} from "@mui/material";
import QuoteCard from "../../components/QuoteCard.tsx";
import BookingCalendar from "../../components/BookingCalendar.tsx";
import type { Slot } from "../../components/BookingCalendar.tsx";


const SearchAppointmentGarage = () => {
    const [slot, setSlot] = useState<Slot | null>(null);

    return (
        <>
            <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700,padding: 5, marginTop: 1, display: "flex", justifyContent: "center" }}>
                    AutoConnect
                </Typography>
                <BookingSteps activeStep={2} />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-around",
                    alignItems: "stretch",
                    gap: 2,
                    px: { xs: 2, sm: 3 },
                }}
            >
                <QuoteCard selectedSlot={slot} />
                <BookingCalendar onPick={setSlot} />
            </Box>


            <Footer />
        </>
    );
};

export default SearchAppointmentGarage;
