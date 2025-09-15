import {useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Footer from "../C_footer/Footer.tsx";
import Header from "../A_header/Header.tsx";

type Appointment = {
    id: number;
    title: string;
    start: string; // format ISO "2025-09-12T09:00:00"
    end: string;   // format ISO "2025-09-12T10:00:00"
};

const GarageCalendar = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: 1,
            title: "Vidange",
            start: "2025-09-12T09:00:00",
            end: "2025-09-12T10:00:00",
        },
        {
            id: 2,
            title: "Révision",
            start: "2025-09-12T11:00:00",
            end: "2025-09-12T12:00:00",
        },
        {
            id: 3,
            title: "Contrôle freins",
            start: "2025-09-13T14:00:00",
            end: "2025-09-13T15:00:00",
        },
    ]);

    // Quand l’utilisateur clique sur un créneau libre
    const handleDateClick = (info: any) => {
        alert(`Créneau choisi : ${info.dateStr}`);
    };

    return (
        <>
            <Header />
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
                events={appointments}
                dateClick={handleDateClick}
                height="auto"
            />
        </div>
    <Footer/>
</>
    );
};

export default GarageCalendar;
