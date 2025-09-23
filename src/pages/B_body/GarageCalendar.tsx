import { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput, EventContentArg } from "@fullcalendar/core";
import { useLoaderData } from "react-router";
import {Box, Typography, Chip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, OutlinedInput, Alert,} from "@mui/material";

import Footer from "../C_footer/Footer";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import NavbarEngineer from "../../components/common/NavbarEngineer";
import HeroTitle from "../../components/common/HeroTitle";
import { putAxiosGarageCalendarSetTech } from "../../api/axiosGarageCalendar";

type ServiceDTO = { id?: number; name?: string };


type Technician = {
    [k: string]: any;
    id?: number | string;
    technicianId?: number | string;
    techicianId?: number | string;
    techId?: number | string;
    engineerId?: number | string;
    userId?: number | string;
    employeeId?: number | string;
    name?: string;
    surname?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    email?: string;
};

type AppointmentResponse = {
    id: number;
    customerId: number;
    customerName: string;
    customerSurname: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    techicianId?: number;
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

const DEBUG = true;

const getToken = (): string | null => {
    const raw = localStorage.getItem("ac.account");
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed?.token || parsed?.accessToken || parsed;
    } catch {
        return raw;
    }
};


const numeric = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};


const techIdOf = (t: Technician): number | null => {
    const candidates: unknown[] = [
        t.id, t.technicianId, t.techicianId, t.techId, t.engineerId, t.userId, t.employeeId,
        t.user?.id, t.account?.id, t.profile?.id,
    ];
    for (const c of candidates) {
        const n = numeric(c);
        if (n != null) return n;
    }

    for (const [k, v] of Object.entries(t)) {
        if (/id$/i.test(k) || /^id$/i.test(k)) {
            const n = numeric(v);
            if (n != null) return n;
        }
    }
    return null;
};


const techLabelOf = (t: Technician, id: number | null): string => {
    const combos = [
        `${t.name ?? ""} ${t.surname ?? ""}`.trim(),
        `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim(),
        String(t.fullName ?? "").trim(),
        String(t.username ?? "").trim(),
        String(t.email ?? "").trim(),
    ].filter(Boolean);
    if (combos.length) return combos[0];
    return id != null ? `Technicien #${id}` : "Technicien";
};

const GarageCalendar = () => {
    const { appointments, technicians } = useLoaderData() as LoaderData;


    const techOptions = useMemo(() => {
        const opts = (technicians ?? [])
            .map((t) => {
                const id = techIdOf(t);
                if (id == null) return null;
                return { id, label: techLabelOf(t, id), _raw: t };
            })
            .filter(Boolean) as { id: number; label: string; _raw: Technician }[];

        if (DEBUG) {

            console.log("technicians (sample 3):", (technicians ?? []).slice(0, 3));
            console.log("techOptions:", opts);
            if (opts.length === 0) {
                console.warn(
                    "Aucun technicien normalisé: tes objets 'technicians' n'ont pas de clé id exploitable. " +
                    "Clés vues sur le 1er élément:",
                    technicians?.[0] ? Object.keys(technicians[0]) : []
                );
            }
        }

        return opts;
    }, [technicians]);

    const techById = useMemo(() => {
        const m = new Map<number, string>();
        techOptions.forEach((o) => m.set(o.id, o.label));
        return m;
    }, [techOptions]);

    const [calendarAppointments, setCalendarAppointments] = useState<EventInput[]>([]);
    const [unassignedAppointments, setUnassignedAppointments] = useState<AppointmentResponse[]>([]);
    const [selectedTechsUnassigned, setSelectedTechsUnassigned] = useState<Record<string, number[]>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [selectedTechsEvent, setSelectedTechsEvent] = useState<number[]>([]);

    useEffect(() => {
        const assigned = appointments
            .filter((a) => a.techicianId != null)
            .map<EventInput>((a) => {
                const techIds = a.techicianId != null ? [a.techicianId] : [];
                const techNames =
                    a.technicianName != null ? [a.technicianName] : techIds.map((id) => techById.get(id) ?? `#${id}`);

                return {
                    id: String(a.id),
                    title: `${a.customerName} ${a.customerSurname}`,
                    start: a.startDate,
                    end: a.endDate,
                    extendedProps: {
                        appointmentId: a.id,
                        techIds,
                        techNames,
                        serviceDTOS: a.serviceDTOS ?? [],
                        customerName: a.customerName,
                        customerSurname: a.customerSurname,
                    },
                };
            });

        const unassigned = appointments.filter((a) => a.techicianId == null);

        setCalendarAppointments(assigned);
        setUnassignedAppointments(unassigned);
    }, [appointments, techById]);


    const handleAssignTechUnassigned = (appointmentIdStr: string, techIds: number[]) => {
        setSelectedTechsUnassigned((prev) => ({ ...prev, [appointmentIdStr]: techIds }));
    };

    const handleValidate = async (appointmentId: number) => {
        const raw = selectedTechsUnassigned[String(appointmentId)] ?? [];
        const techIds = raw.filter((v): v is number => Number.isFinite(v));

        console.log("handleValidate()", { appointmentId, raw, techIds, wholeMap: selectedTechsUnassigned });

        if (!techIds.length) {
            alert("Veuillez sélectionner au moins un technicien.");
            return;
        }

        const appointment = unassignedAppointments.find((a) => a.id === appointmentId);
        if (!appointment) return;

        const token = getToken();
        if (!token) {
            alert("Vous n'êtes pas connecté !");
            return;
        }

        try {
            await Promise.all(techIds.map((tid) => putAxiosGarageCalendarSetTech(token, appointmentId, tid)));
        } catch (err: any) {
            console.error("Assign tech failed:", err?.response?.status, err?.response?.data, { techIds });
            alert(`Impossible d’assigner (HTTP ${err?.response?.status ?? "?"}). Vérifie le token/roles et l’URL.`);
            return;
        }

        const techNames = techIds.map((id) => techById.get(id) ?? `#${id}`);

        const newEvent: EventInput = {
            id: String(appointment.id),
            title: `${appointment.customerName} ${appointment.customerSurname}`,
            start: appointment.startDate,
            end: appointment.endDate,
            extendedProps: {
                appointmentId: appointment.id,
                techIds: techIds.slice(),
                techNames,
                serviceDTOS: appointment.serviceDTOS ?? [],
                customerName: appointment.customerName,
                customerSurname: appointment.customerSurname,
            },
        };

        setCalendarAppointments((prev) => [...prev, newEvent]);
        setUnassignedAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    };


    const openDialogFromEvent = (ev: any) => {
        const ext = ev.extendedProps as {
            appointmentId: number;
            techIds?: number[];
            techNames?: string[];
            serviceDTOS?: ServiceDTO[];
            customerName: string;
            customerSurname: string;
        };

        setSelectedEvent({
            id: String(ev.id),
            customerName: ext.customerName,
            customerSurname: ext.customerSurname,
            start: ev.startStr ?? ev.start?.toISOString() ?? "",
            end: ev.endStr ?? ev.end?.toISOString() ?? "",
            techIds: (ext.techIds ?? []).filter(Boolean),
            techNames: (ext.techNames ?? []).filter(Boolean) as string[],
            serviceDTOS: ext.serviceDTOS ?? [],
        });

        setSelectedTechsEvent((ext.techIds ?? []).filter(Boolean));
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        openDialogFromEvent(clickInfo.event);
    };


    const handleTechChipClick = useCallback(
        (e: React.MouseEvent, eventId: string) => {
            e.stopPropagation();
            const found = calendarAppointments.find((ev) => String(ev.id) === eventId);
            if (!found) return;

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


    const handleUpdateTechEvent = async () => {
        if (!selectedEvent) return;
        if (!selectedTechsEvent || selectedTechsEvent.length === 0) {
            alert("Veuillez sélectionner au moins un technicien.");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Vous n'êtes pas connecté !");
            return;
        }

        const appointmentId = Number(selectedEvent.id);
        try {
            await Promise.all(selectedTechsEvent.map((tid) => putAxiosGarageCalendarSetTech(token, appointmentId, tid)));
        } catch (err: any) {
            console.error("Update tech failed:", err?.response?.status, err?.response?.data, { selectedTechsEvent });
            alert(`Impossible de mettre à jour (HTTP ${err?.response?.status ?? "?"}).`);
            return;
        }

        const techNames = selectedTechsEvent.map((id) => techById.get(id) ?? `#${id}`);

        setCalendarAppointments((prev) =>
            prev.map((ev) => {
                if (String(ev.id) !== selectedEvent.id) return ev;
                const prevExt = (ev.extendedProps as Record<string, unknown>) ?? {};
                return {
                    ...ev,
                    title: `${selectedEvent.customerName} ${selectedEvent.customerSurname}`,
                    extendedProps: {
                        ...prevExt,
                        techIds: selectedTechsEvent.slice(),
                        techNames,
                    },
                };
            })
        );

        setSelectedEvent(null);
        setSelectedTechsEvent([]);
    };


    const noTechOptions = techOptions.length === 0;

    return (
        <>
            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />
            <NavbarEngineer />

            <Box maxWidth={900} mx="auto">
                <Typography variant="h5" textAlign="center" mt={2}>
                    Planning du garage
                </Typography>

                {DEBUG && noTechOptions && (
                    <Box mt={2}>
                        <Alert severity="warning">
                            Aucun technicien détecté. Tes objets <code>technicians</code> ne contiennent pas de clé d’identifiant
                            reconnue (par ex. <code>id</code>, <code>techId</code>, <code>engineerId</code>...). Regarde la console
                            pour voir les 3 premiers éléments et leurs clés. Adapte <code>techIdOf()</code> si besoin.
                        </Alert>
                    </Box>
                )}

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
                            {unassignedAppointments.map((a) => {
                                const key = String(a.id);
                                const selectedIds = selectedTechsUnassigned[key] ?? [];

                                return (
                                    <Box key={`${a.id}-${a.startDate}`} p={2} border="1px solid #eee" borderRadius={2} bgcolor="#fafafa">
                                        <Typography fontWeight="bold">
                                            {a.customerName} {a.customerSurname}
                                        </Typography>
                                        <Stack direction="row" spacing={1} my={1}>
                                            <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`} />
                                            <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`} />
                                        </Stack>


                                        <Select
                                            multiple
                                            size="small"
                                            displayEmpty
                                            value={selectedIds}
                                            onChange={(e) => {
                                                const val = e.target.value as Array<string | number>;
                                                const ids = val
                                                    .map((v) => (typeof v === "string" ? Number(v) : v))
                                                    .filter((n) => Number.isFinite(n)) as number[];
                                                console.log("Select change -> raw:", e.target.value, "ids:", ids, "for appt", key);
                                                handleAssignTechUnassigned(key, ids);
                                            }}
                                            input={<OutlinedInput />}
                                            sx={{ minWidth: 320 }}
                                        >
                                            {techOptions.map((opt) => (
                                                <MenuItem key={opt.id} value={opt.id}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                            {techOptions.length === 0 && (
                                                <MenuItem disabled value="">
                                                    (Aucun technicien disponible)
                                                </MenuItem>
                                            )}
                                        </Select>

                                        <Button sx={{ mt: 1 }} variant="contained" onClick={() => handleValidate(a.id)} disabled={techOptions.length === 0}>
                                            Valider
                                        </Button>

                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            Services : {a.serviceDTOS?.map((s) => s.name).join(", ") || "Aucun service"}
                                        </Typography>
                                    </Box>
                                );
                            })}
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
                                onChange={(e) => {
                                    const val = e.target.value as Array<string | number>;
                                    const ids = val
                                        .map((v) => (typeof v === "string" ? Number(v) : v))
                                        .filter((n) => Number.isFinite(n)) as number[];
                                    console.log("Modal Select change ->", ids);
                                    setSelectedTechsEvent(ids);
                                }}
                                input={<OutlinedInput />}
                                sx={{ mt: 1, minWidth: 320 }}
                            >
                                {techOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                                {techOptions.length === 0 && (
                                    <MenuItem disabled value="">
                                        (Aucun technicien disponible)
                                    </MenuItem>
                                )}
                            </Select>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Annuler</Button>
                    <Button variant="contained" onClick={handleUpdateTechEvent} disabled={techOptions.length === 0}>
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </>
    );
};

export default GarageCalendar;
