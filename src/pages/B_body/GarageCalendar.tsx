import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { useLoaderData } from "react-router";

import {Box, Typography, Chip, Stack, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions,} from "@mui/material";

import Footer from "../C_footer/Footer";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import NavbarEngineer from "../../components/common/NavbarEngineer";
import HeroTitle from "../../components/common/HeroTitle";

type ServiceDTO = { id?: number; name?: string };

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
    title: string;
    start: string;
    end: string;
    techId?: number;
    serviceDTOS: ServiceDTO[];
};

const GarageCalendar = () => {
    const data = useLoaderData() as AppointmentResponse[];


    const [calendarAppointments, setCalendarAppointments] = useState<EventInput[]>(
        data
            .filter((a) => a.techicianId !== null && a.techicianId !== undefined)
            .map<EventInput>((a) => ({
                id: String(a.customerId),
                title: `${a.customerName} ${a.customerSurname} ${a.technicianName ?? ""}`.trim(),
                start: a.startDate,
                end: a.endDate,
                extendedProps: {
                    techId: a.techicianId,
                    serviceDTOS: a.serviceDTOS ?? [],
                },
            }))
    );

    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>(
        data.filter((a) => a.techicianId === null || a.techicianId === undefined)
    );


    const [selectedTechs, setSelectedTechs] = useState<Record<string, number>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);



    const handleDateClick = (info: DateClickArg) => {
        alert(`Créneau choisi : ${info.dateStr}`);
    };

    const handleAssignTech = (appointmentKey: string, techId: number) => {
        setSelectedTechs((prev) => ({ ...prev, [appointmentKey]: techId }));
    };

    const handleValidate = (appointmentId: number) => {
        const key = String(appointmentId);
        const techId = selectedTechs[key];
        if (!techId) {
            alert("Veuillez sélectionner un technicien avant de valider.");
            return;
        }

        const appointment = unassignedAppointments.find((a) => a.customerId === appointmentId);
        if (!appointment) return;

        const newEvent: EventInput = {
            id: String(appointment.customerId),
            title: `${appointment.customerName} ${appointment.customerSurname} - Tech: Technicien ${techId}`,
            start: appointment.startDate,
            end: appointment.endDate,
            extendedProps: {
                techId,
                serviceDTOS: appointment.serviceDTOS ?? [],
            },
        };

        setCalendarAppointments((prev) => [...prev, newEvent]);
        setUnassignedAppointments((prev) => prev.filter((a) => a.customerId !== appointmentId));

        console.log(`Assignation envoyée au backend : RDV ${appointmentId} → Technicien #${techId}`);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const ev = clickInfo.event;
        const techId = (ev.extendedProps as { techId?: number }).techId;
        const serviceDTOS = (ev.extendedProps as { serviceDTOS?: ServiceDTO[] }).serviceDTOS ?? [];

        setSelectedEvent({
            id: ev.id,
            title: ev.title,
            start: ev.startStr,
            end: ev.endStr!,
            techId,
            serviceDTOS,
        });
    };

    const handleUpdateTech = () => {
        if (!selectedEvent) return;

        const techId = selectedTechs[selectedEvent.id];
        if (!techId) {
            alert("Veuillez sélectionner un technicien.");
            return;
        }

        setCalendarAppointments((prev) =>
            prev.map((ev) => {
                if (String(ev.id) !== selectedEvent.id) return ev;


                const nextTitle =
                    typeof ev.title === "string"
                        ? ev.title.replace(/Tech:.*$/, `Tech: Technicien ${techId}`)
                        : ev.title;

                const prevExt = (ev.extendedProps as { [k: string]: unknown }) ?? {};
                return {
                    ...ev,
                    title: nextTitle,
                    extendedProps: {
                        ...prevExt,
                        techId,
                    },
                };
            })
        );

        console.log(`Mise à jour envoyée au backend : RDV ${selectedEvent.id} → Technicien #${techId}`);
        setSelectedEvent(null);
    };

    return (
        <>
            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />
            <NavbarEngineer />
            <Box maxWidth={900} mx="auto">
                <Typography variant="h5" textAlign="center" mt={2}>
                    Planning du garage
                </Typography>



                <Box sx={{ maxWidth: 900, mx: "auto" }}>

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
                        //slotDuration="00:30:00"
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
                                            <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`} />
                                            <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`} />
                                        </Stack>

                                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                            <Select
                                                size="small"
                                                displayEmpty
                                                value={selectedTechs[String(a.customerId)] ?? ""}
                                                onChange={(e) => handleAssignTech(String(a.customerId), e.target.value as number)}
                                                sx={{ minWidth: 200 }}
                                            >
                                                <MenuItem value="">Choisir un technicien</MenuItem>
                                                <MenuItem value={1}>Technicien 1</MenuItem>
                                                <MenuItem value={2}>Technicien 2</MenuItem>
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
            </Box>

            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
                <DialogTitle>Modifier le technicien</DialogTitle>
                <DialogContent dividers>
                    {selectedEvent && (
                        <Box mb={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Client : {selectedEvent.title.split(" - Tech:")[0]}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                Services :
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                                {selectedEvent.serviceDTOS?.length ? (
                                    selectedEvent.serviceDTOS.map((s, i) => <Chip key={i} label={s.name || `Service #${i + 1}`} />)
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
                                Technicien actuel : {selectedEvent.techId ? `Technicien ${selectedEvent.techId}` : "Non assigné"}
                            </Typography>
                        </Box>
                    )}

                    <Select
                        size="small"
                        displayEmpty
                        value={selectedEvent ? selectedTechs[selectedEvent.id] ?? "" : ""}
                        onChange={(e) => selectedEvent && handleAssignTech(selectedEvent.id, e.target.value as number)}
                        sx={{ minWidth: 200, mt: 2 }}
                    >
                        <MenuItem value="">Choisir un technicien</MenuItem>
                        <MenuItem value={1}>Technicien 1</MenuItem>
                        <MenuItem value={2}>Technicien 2</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Annuler</Button>
                    <Button variant="contained" onClick={handleUpdateTech}>
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </>
    );
};

export default GarageCalendar;
