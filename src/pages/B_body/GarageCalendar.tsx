import {useState, useEffect} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {EventClickArg, EventInput} from "@fullcalendar/core";
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
    DialogActions,
    OutlinedInput,
} from "@mui/material";

import Footer from "../C_footer/Footer";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import NavbarEngineer from "../../components/common/NavbarEngineer";
import HeroTitle from "../../components/common/HeroTitle";
import {putAxiosGarageCalendarSetTech} from "../../api/axiosGarageCalendar.ts";

type ServiceDTO = { id?: number; name?: string };
type Technician = { id: number; name: string; surname: string };

type AppointmentResponse = {
    id: number;
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    techicianId?: number; // backend field
    technicianName?: string;
    serviceDTOS?: ServiceDTO[];
};

type SelectedEvent = {
    id: string;
    customerName: string;
    customerSurname: string;
    start: string;
    end: string;
    techIds: number[];
    techNames: string[];
    serviceDTOS: ServiceDTO[];
};

type LoaderData = {
    appointments: AppointmentResponse[];
    technicians: Technician[];
};

const GarageCalendar = () => {
    const {appointments, technicians} = useLoaderData() as LoaderData;

    const [calendarAppointments, setCalendarAppointments] = useState<EventInput[]>([]);
    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>([]);
    const [selectedTechsUnassigned, setSelectedTechsUnassigned] = useState<Record<string, number[]>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [selectedTechsEvent, setSelectedTechsEvent] = useState<number[]>([]);

    useEffect(() => {
        const assigned = appointments
            .filter(a => a.techicianId != null)
            .map<EventInput>(a => ({
                id: String(a.id),
                title: `${a.customerName} ${a.customerSurname} - Tech: ${a.technicianName ?? ""}`,
                start: a.startDate,
                end: a.endDate,
                extendedProps: {
                    techIds: a.techicianId ? [a.techicianId] : [],
                    techNames: a.technicianName ? [a.technicianName] : [],
                    serviceDTOS: a.serviceDTOS ?? [],
                    customerName: a.customerName,
                    customerSurname: a.customerSurname,
                },
            }));

        const unassigned = appointments.filter(a => !a.techicianId);

        setCalendarAppointments(assigned);
        setUnassignedAppointments(unassigned);
    }, [appointments]);

    const handleAssignTechUnassigned = (appointmentKey: string, techIds: number[]) => {
        setSelectedTechsUnassigned(prev => ({...prev, [appointmentKey]: techIds}));
    };

    const handleValidate = async (appointmentId: number) => {
        const techIds = selectedTechsUnassigned[String(appointmentId)];
        if (!techIds || techIds.length === 0) {
            alert("Veuillez sélectionner au moins un technicien avant de valider.");
            return;
        }

        const appointment = unassignedAppointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        const token = localStorage.getItem("ac.account");
        if (!token) {
            alert("Vous n'êtes pas connecté !");
            return;
        }

        for (const techId of techIds) {
            console.log(`Assigning ${techId} to ${appointmentId}`);
            await putAxiosGarageCalendarSetTech(token, appointmentId, techId);
        }

        const techNames = techIds.map(id => {
            const t = technicians.find(t => t.id === id);
            return t ? `${t.name} ${t.surname}` : "";
        });

        const newEvent: EventInput = {
            id: String(appointment.id),
            title: `${appointment.customerName} ${appointment.customerSurname} - Tech: ${techNames.join(", ")}`,
            start: appointment.startDate,
            end: appointment.endDate,
            extendedProps: {
                techIds: techIds.filter(Boolean), // jamais undefined
                techNames,
                serviceDTOS: appointment.serviceDTOS ?? [],
                customerName: appointment.customerName,
                customerSurname: appointment.customerSurname,
            },
        };

        setCalendarAppointments(prev => [...prev, newEvent]);
        setUnassignedAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const ev = clickInfo.event;
        const ext = ev.extendedProps as any;

        const techIds = Array.isArray(ext.techIds) ? ext.techIds.filter(Boolean) : [];

        setSelectedEvent({
            id: ev.id,
            customerName: ext.customerName,
            customerSurname: ext.customerSurname,
            start: ev.startStr,
            end: ev.endStr!,
            techIds,
            techNames: ext.techNames ?? [],
            serviceDTOS: ext.serviceDTOS ?? [],
        });

        setSelectedTechsEvent(techIds);
    };

    const handleUpdateTechEvent = () => {
        if (!selectedEvent) return;
        if (!selectedTechsEvent || selectedTechsEvent.length === 0) {
            alert("Veuillez sélectionner au moins un technicien.");
            return;
        }

        const techNames = selectedTechsEvent.map(id => {
            const t = technicians.find(t => t.id === id);
            return t ? `${t.name} ${t.surname}` : "";
        });

        setCalendarAppointments(prev =>
            prev.map(ev => {
                if (String(ev.id) !== selectedEvent.id) return ev;
                const prevExt = ev.extendedProps as any;
                return {
                    ...ev,
                    title: `${selectedEvent.customerName} ${selectedEvent.customerSurname} - Tech: ${techNames.join(", ")}`,
                    extendedProps: {
                        ...prevExt,
                        techIds: selectedTechsEvent.filter(Boolean),
                        techNames,
                    },
                };
            })
        );
        setSelectedEvent(null);
        setSelectedTechsEvent([]);
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
                            {unassignedAppointments.map(a => (
                                <Box key={`${a.id}-${a.startDate}`} p={2} border="1px solid #eee"
                                     borderRadius={2} bgcolor="#fafafa">
                                    <Typography fontWeight="bold">
                                        {a.customerName} {a.customerSurname}
                                    </Typography>
                                    <Stack direction="row" spacing={1} my={1}>
                                        <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`}/>
                                        <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`}/>
                                    </Stack>
                                    <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                        <Select
                                            multiple
                                            size="small"
                                            displayEmpty
                                            value={selectedTechsUnassigned[String(a.id)] ?? []}
                                            onChange={e => {
                                                const val = e.target.value;
                                                handleAssignTechUnassigned(
                                                    String(a.id),
                                                    typeof val === "string" ? [Number(val)] : val as number[]
                                                );
                                            }}
                                            input={<OutlinedInput/>}
                                            sx={{minWidth: 250}}
                                        >
                                            {technicians.map(tech => (
                                                <MenuItem key={tech.id} value={tech.id}>
                                                    {tech.name} {tech.surname}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Button variant="contained" onClick={() => handleValidate(a.id)}>
                                            Valider
                                        </Button>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Services : {a.serviceDTOS?.map(s => s.name).join(", ") || "Aucun service"}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>

            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
                <DialogTitle>Modifier le(s) technicien(s)</DialogTitle>
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
                                    selectedEvent.serviceDTOS.map((s, i) => <Chip key={i} label={s.name}/>)
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Aucun service renseigné
                                    </Typography>
                                )}
                            </Stack>
                            <Typography variant="body2">Début
                                : {new Date(selectedEvent.start).toLocaleString("fr-FR")}</Typography>
                            <Typography variant="body2" gutterBottom>Fin
                                : {new Date(selectedEvent.end).toLocaleString("fr-FR")}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Technicien(s) actuel(s) : {selectedEvent.techNames.join(", ") || "Non assigné"}
                            </Typography>

                            <Select
                                multiple
                                size="small"
                                displayEmpty
                                value={selectedTechsEvent}
                                onChange={e => {
                                    const val = e.target.value;
                                    setSelectedTechsEvent(typeof val === "string" ? [Number(val)] : val as number[]);
                                }}
                                input={<OutlinedInput/>}
                                sx={{mt: 1, minWidth: 250}}
                            >
                                {technicians.map(tech => (
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
                    <Button variant="contained" onClick={handleUpdateTechEvent}>
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer/>
        </>
    );
};

export default GarageCalendar;
