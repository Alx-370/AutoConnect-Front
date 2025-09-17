import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Footer from "../C_footer/Footer";
import {useLoaderData} from "react-router";
import HeaderWithLogout from "../A_header/HeaderWithLogout.tsx";
import NavbarEngineer from "../../components/common/NavbarEngineer.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import {Container} from "@mui/material";

type AppointmentResponse = {
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    techicianId?: number; // attention à l’orthographe du backend
    technicianName?: string;
    technicianSurname?: string;
    serviceDTOS: any[];
};

type CalendarEvent = {
    id: number;
    title: string;
    start: string;
    end: string;
};

const GarageCalendar = () => {
    const data = useLoaderData() as AppointmentResponse[];

    const calendarAppointments = data
        .filter(a => a.techicianId !== null && a.techicianId !== undefined)
        .map(a => ({
            id: a.customerId,
            title: `${a.customerName} ${a.customerSurname} - Tech: ${a.technicianName}`,
            start: a.startDate,
            end: a.endDate,
        }));

    const unassignedAppointments = data
        .filter(a => a.techicianId === null || a.techicianId === undefined);

    const handleDateClick = (info: any) => {
        alert(`Créneau choisi : ${info.dateStr}`);
    };

    return (
        <>
            <HeaderWithLogout/>
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>
            <NavbarEngineer />
            <Container>
            <div style={{maxWidth: 900, margin: "0 auto"}}>
                <h2 style={{textAlign: "center"}}>Planning du garage</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    locale="fr"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={calendarAppointments}
                    dateClick={handleDateClick}
                    height="auto"
                />

                {unassignedAppointments.length > 0 && (
                    <div style={{marginTop: 20}}>
                        <h3>Rendez-vous sans technicien assigné</h3>
                        <ul>
                            {unassignedAppointments.map(a => (
                                <li key={a.customerId}>
                                    {a.customerName} {a.customerSurname} — {a.startDate} à {a.endDate}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            </Container>
            <Footer/>
        </>
    );
};

export default GarageCalendar;
