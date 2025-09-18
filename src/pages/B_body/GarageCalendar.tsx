import {useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Footer from "../C_footer/Footer";
import Header from "../A_header/Header";
import {useLoaderData} from "react-router";
import {
    Box,
    Typography,
    Chip,
    Stack,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

type AppointmentResponse = {
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    techicianId?: number;
    technicianName?: string;
    technicianSurname?: string;
    serviceDTOS?: any[];
};

type CalendarEvent = {
    id: number;
    title: string;
    start: string;
    end: string;
    techId?: number;
    serviceDTOS?: any[];
};

const GarageCalendar = () => {
    const data = useLoaderData() as AppointmentResponse[];

    const [calendarAppointments, setCalendarAppointments] = useState<CalendarEvent[]>(
        data
            .filter(a => a.techicianId !== null && a.techicianId !== undefined)
            .map(a => ({
                id: a.customerId,
                title: `${a.customerName} ${a.customerSurname}  ${a.technicianName}`,
                start: a.startDate,
                end: a.endDate,
                techId: a.techicianId,
                serviceDTOS: a.serviceDTOS || [],
            }))
    );

    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>(
        data.filter(a => a.techicianId === null || a.techicianId === undefined)
    );

    const [selectedTechs, setSelectedTechs] = useState<{ [key: number]: number }>({});
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const handleDateClick = (info: any) => {
        alert(`Créneau choisi : ${info.dateStr}`);
    };

    const handleAssignTech = (appointmentId: number, techId: number) => {
        setSelectedTechs(prev => ({...prev, [appointmentId]: techId}));
    };

    const handleValidate = (appointmentId: number) => {
        const techId = selectedTechs[appointmentId];
        if (!techId) {
            alert("Veuillez sélectionner un technicien avant de valider.");
            return;
        }

        const appointment = unassignedAppointments.find(a => a.customerId === appointmentId);
        if (!appointment) return;

        const newEvent: CalendarEvent = {
            id: appointment.customerId,
            title: `${appointment.customerName} ${appointment.customerSurname} - Tech: Technicien ${techId}`,
            start: appointment.startDate,
            end: appointment.endDate,
            techId,
            serviceDTOS: appointment.serviceDTOS || []
        };

        setCalendarAppointments(prev => [...prev, newEvent]);
        setUnassignedAppointments(prev => prev.filter(a => a.customerId !== appointmentId));

        console.log(`Assignation envoyée au backend : RDV ${appointmentId} → Technicien #${techId}`);
    };


    const handleEventClick = (clickInfo: any) => {
        const eventId = Number(clickInfo.event.id); // 👈 on force en number
        const event = calendarAppointments.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
        }
    };


    const handleUpdateTech = () => {
        if (!selectedEvent) return;

        const techId = selectedTechs[selectedEvent.id];
        if (!techId) {
            alert("Veuillez sélectionner un technicien.");
            return;
        }

        setCalendarAppointments(prev =>
            prev.map(ev =>
                ev.id === selectedEvent.id
                    ? {
                        ...ev,
                        techId,
                        title: ev.title.replace(/Tech:.*$/, `Tech: Technicien ${techId}`)
                    }
                    : ev
            )
        );

        console.log(`Mise à jour envoyée au backend : RDV ${selectedEvent.id} → Technicien #${techId}`);
        setSelectedEvent(null);
    };

    return (
        <>
            <Header/>
            <Box maxWidth={900} mx="auto">
                <Typography variant="h5" textAlign="center" mt={2}>
                    Planning du garage
                </Typography>

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
                    eventClick={handleEventClick} // 👈 clique sur RDV
                    height="auto"
                />

                {unassignedAppointments.length > 0 && (
                    <Box mt={4} p={2} border="1px solid #ddd" borderRadius={2} boxShadow={2}>
                        <Typography variant="h6" gutterBottom>
                            Rendez-vous sans technicien assigné
                        </Typography>

                        <Stack spacing={2}>
                            {unassignedAppointments.map(a => (
                                <Box
                                    key={a.customerId}
                                    p={2}
                                    border="1px solid #eee"
                                    borderRadius={2}
                                    bgcolor="#fafafa"
                                >
                                    <Typography fontWeight="bold">
                                        {a.customerName} {a.customerSurname}
                                    </Typography>

                                    <Stack direction="row" spacing={1} my={1}>
                                        <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`}/>
                                        <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`}/>
                                    </Stack>

                                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                        <Select
                                            size="small"
                                            displayEmpty
                                            value={selectedTechs[a.customerId] || ""}
                                            onChange={(e) =>
                                                handleAssignTech(a.customerId, e.target.value as number)
                                            }
                                            sx={{minWidth: 200}}
                                        >
                                            <MenuItem value="">Choisir un technicien</MenuItem>
                                            <MenuItem value={1}>Technicien 1</MenuItem>
                                            <MenuItem value={2}>Technicien 2</MenuItem>
                                        </Select>

                                        <Button
                                            variant="contained"
                                            onClick={() => handleValidate(a.customerId)}
                                        >
                                            Valider
                                        </Button>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>

            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
                <DialogTitle>Modifier le technicien</DialogTitle>
                <DialogContent dividers>
                    {selectedEvent && (
                        <Box mb={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Client : {selectedEvent.title.split(" - Tech:")[0]}
                            </Typography>

                            {/* Services */}
                            <Typography variant="subtitle1" gutterBottom>
                                Services :
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                                {selectedEvent.serviceDTOS.length > 0 ? (
                                    selectedEvent.serviceDTOS.map((s, i) => (
                                        <Chip key={i} label={s.name || `Service #${i + 1}`}/>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Aucun service renseigné
                                    </Typography>
                                )}
                            </Stack>

                            <Typography variant="body2">
                                Début : {new Date(selectedEvent.start).toLocaleString("fr-FR")}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Fin : {new Date(selectedEvent.end).toLocaleString("fr-FR")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Technicien actuel :{" "}
                                {selectedEvent.techId ? `Technicien ${selectedEvent.techId}` : "Non assigné"}
                            </Typography>
                        </Box>
                    )}

                    <Select
                        size="small"
                        displayEmpty
                        value={selectedEvent ? selectedTechs[selectedEvent.id] || "" : ""}
                        onChange={(e) =>
                            handleAssignTech(selectedEvent!.id, e.target.value as number)
                        }
                        sx={{minWidth: 200, mt: 2}}
                    >
                        <MenuItem value="">Choisir un technicien</MenuItem>
                        <MenuItem value={1}>Technicien 1</MenuItem>
                        <MenuItem value={2}>Technicien 2</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Annuler</Button>
                    <Button variant="contained" onClick={handleUpdateTech}>Mettre à jour</Button>
                </DialogActions>
            </Dialog>

            <Footer/>
        </>
    );
};

export default GarageCalendar;
