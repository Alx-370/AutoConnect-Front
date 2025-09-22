import {useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {DateClickArg, EventClickArg, EventInput} from "@fullcalendar/core";
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

import Footer from "../C_footer/Footer";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import NavbarEngineer from "../../components/common/NavbarEngineer";
import HeroTitle from "../../components/common/HeroTitle";

type ServiceDTO = { id?: number; name?: string };

type LoaderData = {
    appointments: AppointmentResponse[];
    technicians: Technician[];
};

type Technician = { id: number; name: string; surname: string };

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
    serviceDTOS?: ServiceDTO[];
};

type SelectedEvent = {
    id: string;
    customerName: string;
    customerSurname: string;
    start: string;
    end: string;
    techId?: number;
    techName?: string;
    techSurname?: string;
    serviceDTOS: ServiceDTO[];
};

const GarageCalendar = () => {
    const {appointments, technicians} = useLoaderData() as LoaderData;

    const [calendarAppointments, setCalendarAppointments] = useState<EventInput[]>(
        appointments
            .filter((a) => a.techicianId != null)
            .map<EventInput>((a) => ({
                id: String(a.customerId),
                title: `${a.customerName} ${a.customerSurname} - Tech: ${a.technicianName} ${a.technicianSurname}`,
                start: a.startDate,
                end: a.endDate,
                extendedProps: {
                    techId: a.techicianId,
                    techName: a.technicianName,
                    techSurname: a.technicianSurname,
                    serviceDTOS: a.serviceDTOS ?? [],
                    customerName: a.customerName,
                    customerSurname: a.customerSurname,
                },
            }))
    );



    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>(
        appointments.filter((a) => a.techicianId == null)
    );

    const [selectedTechs, setSelectedTechs] = useState<Record<string, number | undefined>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);

    const handleDateClick = (info: DateClickArg) => {
        alert(`Créneau choisi : ${info.dateStr}`);
    };

    const handleAssignTech = (appointmentKey: string, techId?: number) => {
        setSelectedTechs((prev) => ({...prev, [appointmentKey]: techId}));
    };

    const handleValidate = (appointmentId: number) => {
        const key = String(appointmentId);
        const techId = selectedTechs[key];
        if (techId == null) {
            alert("Veuillez sélectionner un technicien avant de valider.");
            return;
        }

        const appointment = unassignedAppointments.find((a) => a.customerId === appointmentId);
        if (!appointment) return;

        const technician = technicians.find((t) => t.id === techId);

        const newEvent: EventInput = {
            id: String(appointment.customerId),
            title: `${appointment.customerName} ${appointment.customerSurname} - Tech: ${technician?.name} ${technician?.surname}`,
            start: appointment.startDate,
            end: appointment.endDate,
            extendedProps: {
                techId,
                techName: technician?.name,
                techSurname: technician?.surname,
                serviceDTOS: appointment.serviceDTOS ?? [],
                customerName: appointment.customerName,
                customerSurname: appointment.customerSurname,
            },
        };

        setCalendarAppointments((prev) => [...prev, newEvent]);
        setUnassignedAppointments((prev) => prev.filter((a) => a.customerId !== appointmentId));
    };


    const handleEventClick = (clickInfo: EventClickArg) => {
        const ev = clickInfo.event;
        const ext = ev.extendedProps as {
            techId?: number;
            techName?: string;
            techSurname?: string;
            serviceDTOS?: ServiceDTO[];
            customerName: string;
            customerSurname: string;
        };

        setSelectedEvent({
            id: ev.id,
            customerName: ext.customerName,
            customerSurname: ext.customerSurname,
            start: ev.startStr,
            end: ev.endStr!,
            techId: ext.techId,
            techName: ext.techName,
            techSurname: ext.techSurname,
            serviceDTOS: ext.serviceDTOS ?? [],
        });

        setSelectedTechs((prev) => ({...prev, [ev.id]: ext.techId}));
    };

    const handleUpdateTech = () => {
        const technician = technicians.find((t) => t.id === techId);
        if (!selectedEvent) return;

        const techId = selectedTechs[selectedEvent.id];
        if (techId == null) {
            alert("Veuillez sélectionner un technicien.");
            return;
        }

        setCalendarAppointments((prev) =>
            prev.map((ev) => {
                if (String(ev.id) !== selectedEvent.id) return ev;

                const prevExt = ev.extendedProps as { [k: string]: unknown };
                return {
                    ...ev,
                    title: `${selectedEvent.customerName} ${selectedEvent.customerSurname} - Tech: ${technician?.name} ${technician?.surname}`,
                    extendedProps: {...prevExt, techId, techName: technician?.name, techSurname: technician?.surname},
                };
            })
        );

        setSelectedEvent(null);
    };

    return (
        <>
            <HeaderWithLogout/>
            <HeroTitle title="AutoConnect" sx={{mt: 3}}/>
            <NavbarEngineer/>

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
                    eventClick={handleEventClick}
                    height="auto"
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    hiddenDays={[0]}
                    allDaySlot={false}
                />

                {unassignedAppointments.length > 0 && (
                    <Box mt={4} p={2} border="1px solid #ddd" borderRadius={2} boxShadow={2}>
                        <Typography variant="h6" gutterBottom>
                            Rendez-vous sans technicien assigné
                        </Typography>
                        <Stack spacing={2}>
                            {unassignedAppointments.map((a) => (
                                <Box
                                    key={`${a.customerId}-${a.startDate}`}
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
                                            value={selectedTechs[String(a.customerId)] ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleAssignTech(String(a.customerId), val === "" ? undefined : Number(val));
                                            }}
                                            sx={{minWidth: 200}}
                                        >
                                            <MenuItem value="">Choisir un technicien</MenuItem>
                                            {technicians.map((tech) => (
                                                <MenuItem key={tech.id} value={tech.id}>
                                                    {tech.name} {tech.surname}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Button variant="contained" onClick={() => handleValidate(a.customerId)}>
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
                                Client : {selectedEvent.customerName} {selectedEvent.customerSurname}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                Services :
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                                {selectedEvent.serviceDTOS.length ? (
                                    selectedEvent.serviceDTOS.map((s, i) => <Chip key={i}
                                                                                  label={s.name || `Service #${i + 1}`}/>)
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
                                {selectedEvent.techName ? `${selectedEvent.techName} ${selectedEvent.techSurname}` : "Non assigné"}
                            </Typography>


                            <Select
                                size="small"
                                displayEmpty
                                value={selectedTechs[selectedEvent.id] ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleAssignTech(selectedEvent.id, val === "" ? undefined : Number(val));
                                }}
                                sx={{minWidth: 200, mt: 2}}
                            >
                                <MenuItem value="">Choisir un technicien</MenuItem>
                                {technicians.map((tech) => (
                                    <MenuItem key={tech.id} value={tech.id}>
                                        {tech.name} {tech.surname}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Annuler</Button>
                    <Button variant="contained" onClick={handleUpdateTech}>
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer/>
        </>
    );
};

export default GarageCalendar;
