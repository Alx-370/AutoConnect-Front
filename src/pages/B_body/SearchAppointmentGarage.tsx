import {useEffect, useState} from "react";
import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import BookingSteps from "../../components/booking/BookingSteps.tsx";
import {Box} from "@mui/material";
import QuoteCard from "../../components/booking/QuoteCard.tsx";
import BookingCalendar from "../../components/booking/BookingCalendar.tsx";
import type { Slot } from "../../components/booking/BookingCalendar.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import {fetchCalendar} from "../../api/axiosCalendar.ts";
import type {ApointmentDto} from "../../types/apointment-dto.ts";

const SearchAppointmentGarage = () => {
    const [slot, setSlot] = useState<Slot | null>(null);
    const[ garageId, setGarageId] = useState<number | null>(null);
    const [data, setData] = useState<ApointmentDto>();

    const getGarageHoursForDate = (garageOpeningHours: any , date: any) => {
        const daysMap: Record<string, string> = {
            lundi: "MONDAY",
            mardi: "TUESDAY",
            mercredi: "WEDNESDAY",
            jeudi: "THURSDAY",
            vendredi: "FRIDAY",
            samedi: "SATURDAY",
            dimanche: "SUNDAY",
        };
        if (!garageOpeningHours || !date) return null;
        const dayOfWeekFr = date.format("dddd").toLowerCase();
        const dayOfWeek = daysMap[dayOfWeekFr];
        const dayConfig = garageOpeningHours.find(d => d.dayOfWeek === dayOfWeek);

        if (!dayConfig) return null;

        const openingHour = parseInt(dayConfig.openingHour.split(":")[0], 10);
        const closingHour = parseInt(dayConfig.closingHour.split(":")[0], 10);

        return {openingHour, closingHour};
    };

    useEffect(() => {
        const saved = localStorage.getItem("ac.selection");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.id) {
                    setGarageId(parsed.id);
                    console.log(parsed.id);
                }
            } catch (e) {
                console.error("Impossible de parser le localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (garageId !== null) {
            console.log("Garage ID:", garageId);
            fetchCalendar(garageId).then(
                (res) => {
                    console.log(res);
                    setData(res);
                }
            );
        }
    }, [garageId]);

    return (
        <>
            <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center" }}>
                <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>
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
                {data && (
                    <BookingCalendar
                        onPick={setSlot}
                        disabledTimes={data.appointment}
                        getHoursForDate={(date) => getGarageHoursForDate(data?.garageOpeningHours, date)}
                    />
                )}
            </Box>

            <Footer />
        </>
    );
};

export default SearchAppointmentGarage;
