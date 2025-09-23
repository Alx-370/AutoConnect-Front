import {useState, useEffect, useCallback} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {EventClickArg, EventInput, EventContentArg} from "@fullcalendar/core";
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

    startDate: string; // ISO
    endDate: string;   // ISO
    techicianId?: number; // (on garde le nom venant de l’API)

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

const keyOfAppt = (a: { customerId: number; startDate: string }) =>
    `${a.customerId}-${a.startDate}`;

const toNumberArray = (val: unknown): number[] => {
    const arr = Array.isArray(val) ? val : [val];
    return arr.map(v => (typeof v === "string" ? Number(v) : (v as number))).filter(v => !Number.isNaN(v)) as number[];
};

const GarageCalendar = () => {
    const { appointments, technicians } = useLoaderData() as LoaderData;

    const [calendarAppointments, setCalendarAppointments] = useState<EventInput[]>([]);
    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>([]);
    const [selectedTechsUnassigned, setSelectedTechsUnassigned] = useState<Record<string, number[]>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [selectedTechsEvent, setSelectedTechsEvent] = useState<number[]>([]);


    // Mapper assignés / non assignés
    useEffect(() => {
        const assigned = appointments
            .filter(a => a.techicianId != null)
            .map<EventInput>(a => {
                const techIds = a.techicianId != null ? [a.techicianId] : [];
                const techNames = a.technicianName ? [a.technicianName] : [];
                return {
                    id: keyOfAppt(a),
                    // on laisse un titre court : le rendu riche se fera dans eventContent
                    title: `${a.customerName} ${a.customerSurname}`,
                    start: a.startDate,
                    end: a.endDate,
                    extendedProps: {
                        techIds,
                        techNames,
                        serviceDTOS: a.serviceDTOS ?? [],
                        customerName: a.customerName,
                        customerSurname: a.customerSurname,
                    },
                };
            });

        const unassigned = appointments.filter(a => a.techicianId == null);

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
        setSelectedTechsUnassigned(prev => ({ ...prev, [appointmentKey]: techIds }));
    };


    const handleValidate = (appointmentKey: string) => {
        const techIds = selectedTechsUnassigned[appointmentKey];

    const handleValidate = async (appointmentId: number) => {
        const techIds = selectedTechsUnassigned[String(appointmentId)];

        if (!techIds || techIds.length === 0) {
            alert("Veuillez sélectionner au moins un technicien avant de valider.");
            return;
        }


        const appointment = unassignedAppointments.find(a => keyOfAppt(a) === appointmentKey);
        if (!appointment) return;

        const techNames = techIds
            .map(id => technicians.find(t => t.id === id))
            .filter((t): t is Technician => !!t)
            .map(t => `${t.name} ${t.surname}`);

        const newEvent: EventInput = {
            id: keyOfAppt(appointment),
            title: `${appointment.customerName} ${appointment.customerSurname}`,

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

        setUnassignedAppointments(prev => prev.filter(a => keyOfAppt(a) !== appointmentKey));
    };

    const openDialogFromEvent = (ev: any) => {
        const ext = ev.extendedProps as {
            techIds?: number[];
            techNames?: string[];
            serviceDTOS?: ServiceDTO[];
            customerName: string;
            customerSurname: string;
        };

        setUnassignedAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const ev = clickInfo.event;
        const ext = ev.extendedProps as any;

        const techIds = Array.isArray(ext.techIds) ? ext.techIds.filter(Boolean) : [];


        setSelectedEvent({
            id: String(ev.id),
            customerName: ext.customerName,
            customerSurname: ext.customerSurname,

            start: ev.startStr ?? ev.start?.toISOString() ?? "",
            end: ev.endStr ?? ev.end?.toISOString() ?? "",
            techIds: ext.techIds ?? [],

            start: ev.startStr,
            end: ev.endStr!,
            techIds,

            techNames: ext.techNames ?? [],
            serviceDTOS: ext.serviceDTOS ?? [],
        });

        setSelectedTechsEvent(techIds);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        // clic n'importe où sur l'event
        openDialogFromEvent(clickInfo.event);
    };

    // 🔹 Clic direct sur le NOM du technicien (Chip cliquable)
    const handleTechChipClick = useCallback(
        (e: React.MouseEvent, eventId: string) => {
            e.stopPropagation(); // IMPORTANT : ne pas déclencher d'autres handlers FullCalendar
            const found = calendarAppointments.find(ev => String(ev.id) === eventId);
            if (!found) return;

            // Reconstituer un pseudo-Event pour réutiliser openDialogFromEvent
            const pseudoEvent = {
                id: found.id,
                startStr: String(found.start),
                endStr: String(found.end),
                extendedProps: found.extendedProps ?? {},
            };
            openDialogFromEvent(pseudoEvent as any);
        },
        [calendarAppointments]
    );

    // Rendu personnalisé des events : client + chips de techniciens cliquables
    const renderEventContent = useCallback(
        (arg: EventContentArg) => {
            const ext = arg.event.extendedProps as {
                techNames?: string[];
                customerName?: string;
                customerSurname?: string;
            };

            const names = ext.techNames ?? [];

            return (
                <Box px={0.5} py={0.25}>
                    <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                        {ext.customerName} {ext.customerSurname}
                    </Typography>
                    {!!names.length && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.25}>
                            {names.map((n, idx) => (
                                <Chip
                                    key={`${arg.event.id}-tech-${idx}`}
                                    size="small"
                                    label={n}
                                    clickable
                                    onClick={(e) => handleTechChipClick(e, String(arg.event.id))}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            );
        },
        [handleTechChipClick]
    );

    const handleUpdateTechEvent = () => {
        if (!selectedEvent) return;
        if (!selectedTechsEvent || selectedTechsEvent.length === 0) {
            alert("Veuillez sélectionner au moins un technicien.");
            return;
        }


        const techNames = selectedTechsEvent
            .map(id => technicians.find(t => t.id === id))
            .filter((t): t is Technician => !!t)
            .map(t => `${t.name} ${t.surname}`);

        const techNames = selectedTechsEvent.map(id => {
            const t = technicians.find(t => t.id === id);
            return t ? `${t.name} ${t.surname}` : "";
        });


        setCalendarAppointments(prev =>
            prev.map(ev => {
                if (String(ev.id) !== selectedEvent.id) return ev;

                const prevExt = (ev.extendedProps as Record<string, unknown>) ?? {};

                const prevExt = ev.extendedProps as any;

                return {
                    ...ev,
                    // le titre reste le nom du client (les techs sont affichés via eventContent)
                    title: `${selectedEvent.customerName} ${selectedEvent.customerSurname}`,
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
            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />
            <NavbarEngineer />

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
                    eventContent={renderEventContent}
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

                            {unassignedAppointments.map(a => {
                                const key = keyOfAppt(a);
                                return (
                                    <Box key={key} p={2} border="1px solid #eee" borderRadius={2} bgcolor="#fafafa">
                                        <Typography fontWeight="bold">
                                            {a.customerName} {a.customerSurname}
                                        </Typography>
                                        <Stack direction="row" spacing={1} my={1}>
                                            <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`} />
                                            <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                            <Select
                                                multiple
                                                size="small"
                                                displayEmpty
                                                value={selectedTechsUnassigned[key] ?? []}
                                                onChange={e => {
                                                    const techIds = toNumberArray(e.target.value);
                                                    handleAssignTechUnassigned(key, techIds);
                                                }}
                                                input={<OutlinedInput />}
                                                sx={{ minWidth: 250 }}
                                            >
                                                {technicians.map(tech => (
                                                    <MenuItem key={tech.id} value={tech.id}>
                                                        {tech.name} {tech.surname}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <Button variant="contained" onClick={() => handleValidate(key)}>
                                                Valider
                                            </Button>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            Services : {a.serviceDTOS?.map(s => s.name).join(", ") || "Aucun service"}
                                        </Typography>
                                    </Box>
                                );
                            })}

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
                                    selectedEvent.serviceDTOS.map((s, i) => <Chip key={i} label={s.name} />)
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
                                Technicien(s) actuel(s) : {selectedEvent.techNames.join(", ") || "Non assigné"}
                            </Typography>

                            <Select
                                multiple
                                size="small"
                                displayEmpty
                                value={selectedTechsEvent}
                                onChange={e => setSelectedTechsEvent(toNumberArray(e.target.value))}
                                input={<OutlinedInput />}
                                sx={{ mt: 1, minWidth: 250 }}
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

            <Footer />
        </>
    );
};

export default GarageCalendar;
