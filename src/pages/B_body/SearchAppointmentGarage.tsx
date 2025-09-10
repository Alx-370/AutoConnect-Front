import { useState } from "react";
import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import BookingSteps from "../../components/BookingSteps.tsx";
import {Box} from "@mui/material";
import QuoteCard from "../../components/QuoteCard.tsx";
import BookingCalendar from "../../components/BookingCalendar.tsx";
import type { Slot } from "../../components/BookingCalendar.tsx";
import HeroTitle from "../../components/HeroTitle.tsx";


const SearchAppointmentGarage = () => {
    const [slot, setSlot] = useState<Slot | null>(null);

    return (
        <>
            <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center" }}>
                <HeroTitle
                    title="AutoConnect"
                    sx={{ mt: 3 }}
                />
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
