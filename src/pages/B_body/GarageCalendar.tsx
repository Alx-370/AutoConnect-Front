import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {EventClickArg, EventInput, EventApi, EventMountArg,} from "@fullcalendar/core";
import { useLoaderData } from "react-router";
import {Container, Box, Typography, Chip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Grid, Divider, Autocomplete, TextField, Checkbox, Avatar, OutlinedInput, MenuItem, Select,} from "@mui/material";
import Footer from "../C_footer/Footer";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import NavbarEngineer from "../../components/common/NavbarEngineer";
import HeroTitle from "../../components/common/HeroTitle";
import { putAxiosGarageCalendarSetTech } from "../../api/axiosGarageCalendar";
import type {AppointmentResponse, LoaderData, SelectedEvent, ServiceDTO, Technician} from "../../types/calendar-garage.ts";
import renderEventContent, {colorForId} from "../../components/common/renderEventContent.tsx";


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

const toNumber = (v: unknown): number | null => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const getTechId = (t: Technician): number | null => {
    const tries = [
        t.id,
        t.technicianId,
        t.techicianId,
        t.techId,
        t.engineerId,
        t.userId,
        t.employeeId,
        (t as any)?.user?.id,
        (t as any)?.account?.id,
        (t as any)?.profile?.id,
    ];
    for (const v of tries) {
        const n = toNumber(v);
        if (n != null) return n;
    }
    return null;
};

const getTechLabel = (t: Technician, id: number | null): string => {
    const c1 = `${t.name ?? ""} ${t.surname ?? ""}`.trim();
    const c2 = `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim();
    const c3 = String(t.fullName ?? "").trim();
    const c4 = String(t.username ?? "").trim();
    const c5 = String(t.email ?? "").trim();
    const arr = [c1, c2, c3, c4, c5].filter(Boolean);
    if (arr.length) return arr[0];
    return id != null ? `Technicien #${id}` : "Technicien";
};


const GarageCalendar = () => {
    const { appointments, technicians } = useLoaderData() as LoaderData;

    const techOptions = useMemo(() => {
        return (technicians ?? [])
            .map((t) => {
                const id = getTechId(t);
                if (id == null) return null;
                return { id, label: getTechLabel(t, id), color: colorForId(id), _raw: t };
            })
            .filter(Boolean) as { id: number; label: string; color: string; _raw: Technician }[];
    }, [technicians]);

    const techById = useMemo(() => {
        const map = new Map<number, { label: string; color: string }>();
        techOptions.forEach((o) => map.set(o.id, { label: o.label, color: o.color }));
        return map;
    }, [techOptions]);

    const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
    const [unassigned, setUnassigned] = useState<AppointmentResponse[]>([]);
    const [choiceForUnassigned, setChoiceForUnassigned] = useState<Record<string, number[]>>({});
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [selectedTechsEvent, setSelectedTechsEvent] = useState<number[]>([]);
    const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);

    useEffect(() => {
        const assigned = appointments
            .filter((a) => a.techicianId != null)
            .map<EventInput>((a) => {
                const techIds = a.techicianId != null ? [a.techicianId] : [];
                const techNames =
                    a.technicianName != null ? [a.technicianName] : techIds.map((id) => techById.get(id)?.label ?? `#${id}`);
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

        const withoutTech = appointments.filter((a) => a.techicianId == null);

        setCalendarEvents(assigned);
        setUnassigned(withoutTech);
    }, [appointments, techById]);

    const eventsToShow = useMemo(() => {
        if (!selectedTechIds.length) return calendarEvents;
        const wanted = new Set(selectedTechIds);
        return calendarEvents.filter((ev) => {
            const ext = (ev.extendedProps ?? {}) as { techIds?: number[] };
            const ids = ext.techIds ?? [];
            return ids.some((id) => wanted.has(Number(id)));
        });
    }, [calendarEvents, selectedTechIds]);

    const handleAssignPick = (appId: string, techIds: number[]) => {
        setChoiceForUnassigned((prev) => ({ ...prev, [appId]: techIds }));
    };

    const handleValidateAssign = async (appointmentId: number) => {
        const picked = choiceForUnassigned[String(appointmentId)] ?? [];
        const techIds = picked.filter((n) => Number.isFinite(n));
        if (!techIds.length) {
            alert("Sélectionne au moins un technicien.");
            return;
        }
        const appt = unassigned.find((a) => a.id === appointmentId);
        if (!appt) return;

        const token = getToken();
        if (!token) {
            alert("Tu n'es pas connecté.");
            return;
        }

        try {
            await Promise.all(techIds.map((tid) => putAxiosGarageCalendarSetTech(token, appointmentId, tid)));
        } catch (e) {
            alert("Impossible d’assigner. Vérifie tes droits/URL.");
            return;
        }

        const techNames = techIds.map((id) => techById.get(id)?.label ?? `#${id}`);

        const newEvent: EventInput = {
            id: String(appt.id),
            title: `${appt.customerName} ${appt.customerSurname}`,
            start: appt.startDate,
            end: appt.endDate,
            extendedProps: {
                appointmentId: appt.id,
                techIds: techIds.slice(),
                techNames,
                serviceDTOS: appt.serviceDTOS ?? [],
                customerName: appt.customerName,
                customerSurname: appt.customerSurname,
            },
        };

        setCalendarEvents((prev) => [...prev, newEvent]);
        setUnassigned((prev) => prev.filter((a) => a.id !== appointmentId));
    };

    const openDialogFromEvent = (ev: EventApi) => {
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

    const handleEventClick = (arg: EventClickArg) => openDialogFromEvent(arg.event);


    const handleSaveEventTechs = async () => {
        if (!selectedEvent) return;
        if (!selectedTechsEvent.length) {
            alert("Sélectionne au moins un technicien.");
            return;
        }
        const token = getToken();
        if (!token) {
            alert("Tu n'es pas connecté.");
            return;
        }
        const appointmentId = Number(selectedEvent.id);
        try {
            await Promise.all(selectedTechsEvent.map((tid) => putAxiosGarageCalendarSetTech(token, appointmentId, tid)));
        } catch (e) {
            alert("Impossible de mettre à jour.");
            return;
        }

        const techNames = selectedTechsEvent.map((id) => techById.get(id)?.label ?? `#${id}`);

        setCalendarEvents((prev) =>
            prev.map((ev) => {
                if (String(ev.id) !== selectedEvent.id) return ev;
                const ext = (ev.extendedProps as any) ?? {};
                return {
                    ...ev,
                    title: `${selectedEvent.customerName} ${selectedEvent.customerSurname}`,
                    extendedProps: {
                        ...ext,
                        techIds: selectedTechsEvent.slice(),
                        techNames,
                    },
                };
            })
        );

        setSelectedEvent(null);
        setSelectedTechsEvent([]);
    };

    const handleEventDidMount = (arg: EventMountArg) => {
        const ext = arg.event.extendedProps as { techIds?: number[] };
        const firstId = ext.techIds?.[0];
        if (!Number.isFinite(firstId)) return;

        const base = colorForId(Number(firstId));

        arg.el.style.setProperty("--fc-event-bg-color", base);
        arg.el.style.setProperty("--fc-event-text-color", "#fff");
        arg.el.style.setProperty("--fc-event-border-color", "#fff");

        (arg.el as HTMLElement).style.backgroundColor = base;
        (arg.el as HTMLElement).style.color = "#fff";
        (arg.el as HTMLElement).style.borderColor = "#fff";
        (arg.el as HTMLElement).style.borderWidth = "2px";
        (arg.el as HTMLElement).style.borderStyle = "solid";

        const main = arg.el.querySelector(".fc-event-main") as HTMLElement | null;
        if (main) {
            main.style.backgroundColor = base;
            main.style.color = "#fff";
        }
        const time = arg.el.querySelector(".fc-event-time") as HTMLElement | null;
        if (time) time.style.color = "#fff";
    };

    const headerToolbar = {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
    };

    return (
        <>
            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: { xs: 2, md: 3 } }} />
            <NavbarEngineer />

            <Container maxWidth="lg" sx={{ pb: 4 }}>
                <Typography variant="h5" textAlign="center" mt={2}>
                    Planning du garage
                </Typography>

                {techOptions.length === 0 && (
                    <Box mt={2}>
                        <Alert severity="warning">Aucun technicien détecté. Vérifie les données.</Alert>
                    </Box>
                )}


                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Select
                            multiple
                            size="small"
                            displayEmpty
                            input={<OutlinedInput />}
                            value={selectedTechIds}
                            onChange={(e) => {
                                const val = e.target.value as number[];
                                setSelectedTechIds(val ?? []);
                            }}
                            renderValue={(selected) =>
                                (selected as number[]).length === 0
                                    ? "Filtrer par technicien…"
                                    : (selected as number[])
                                        .map((id) => techById.get(id)?.label ?? `#${id}`)
                                        .join(", ")
                            }
                            sx={{ minWidth: 280 }}
                        >
                            {techOptions.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>
                                    <Checkbox checked={selectedTechIds.indexOf(opt.id) > -1} sx={{ mr: 1 }} />
                                    <Avatar sx={{ width: 22, height: 22, bgcolor: opt.color, fontSize: 11, mr: 1 }}>
                                        {opt.label.slice(0, 1).toUpperCase()}
                                    </Avatar>
                                    <Typography>{opt.label}</Typography>
                                </MenuItem>
                            ))}
                            {techOptions.length === 0 && (
                                <MenuItem disabled value="">
                                    (Aucun technicien disponible)
                                </MenuItem>
                            )}
                        </Select>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedTechIds(techOptions.map((o) => o.id))}
                            disabled={techOptions.length === 0 || selectedTechIds.length === techOptions.length}
                        >
                            Tout
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setSelectedTechIds([])}
                            disabled={selectedTechIds.length === 0}
                        >
                            Aucun
                        </Button>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: { xs: 1, md: 2 },
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        locale="fr"
                        buttonText={{ today: "Aujourd’hui", month: "Mois", week: "Semaine", day: "Jour" }}
                        headerToolbar={headerToolbar}
                        events={eventsToShow}
                        eventContent={renderEventContent}
                        eventClick={handleEventClick}
                        eventDidMount={handleEventDidMount}
                        expandRows
                        nowIndicator
                        dayMaxEventRows={3}
                        height="auto"
                        contentHeight="auto"
                        slotDuration="00:30:00"
                        slotLabelInterval="00:30"
                        slotMinTime="07:00:00"
                        slotMaxTime="20:00:00"
                        hiddenDays={[0]}
                        allDaySlot={false}
                    />
                </Box>

                {unassigned.length > 0 && (
                    <Box
                        mt={4}
                        p={{ xs: 1.5, md: 2 }}
                        border="1px solid"
                        borderColor="divider"
                        borderRadius={2}
                        boxShadow={2}
                        bgcolor="background.paper"
                    >
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <Typography variant="h6">Rendez-vous sans technicien assigné</Typography>
                            <Divider flexItem sx={{ ml: 1 }} />
                        </Stack>

                        <Grid container spacing={2}>
                            {unassigned.map((a) => {
                                const key = String(a.id);
                                const selectedIds = choiceForUnassigned[key] ?? [];

                                return (
                                    <Grid key={`${a.id}-${a.startDate}`} size={{ xs: 12, md: 6 }}>
                                        <Box
                                            p={{ xs: 1.5, md: 2 }}
                                            border="1px solid"
                                            borderColor="divider"
                                            borderRadius={2}
                                            bgcolor="#fafafa"
                                            sx={{ height: "100%" }}
                                        >
                                            <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                                {a.customerName} {a.customerSurname}
                                            </Typography>

                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={1}
                                                useFlexGap
                                                flexWrap="wrap"
                                                sx={{ mb: 1 }}
                                            >
                                                <Chip label={`Début : ${new Date(a.startDate).toLocaleString("fr-FR")}`} />
                                                <Chip label={`Fin : ${new Date(a.endDate).toLocaleString("fr-FR")}`} />
                                            </Stack>

                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                                                <Select
                                                    multiple
                                                    size="small"
                                                    displayEmpty
                                                    fullWidth
                                                    value={selectedIds}
                                                    onChange={(e) => {
                                                        const val = e.target.value as Array<string | number>;
                                                        const ids = val
                                                            .map((v) => (typeof v === "string" ? Number(v) : v))
                                                            .filter((n) => Number.isFinite(n)) as number[];
                                                        handleAssignPick(key, ids);
                                                    }}
                                                    input={<OutlinedInput />}
                                                    sx={{ minWidth: { xs: "100%", sm: 280 } }}
                                                >
                                                    {techOptions.map((opt) => (
                                                        <MenuItem key={opt.id} value={opt.id}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Avatar sx={{ width: 22, height: 22, bgcolor: opt.color, fontSize: 11 }}>
                                                                    {opt.label.slice(0, 1).toUpperCase()}
                                                                </Avatar>
                                                                <span>{opt.label}</span>
                                                            </Stack>
                                                        </MenuItem>
                                                    ))}
                                                    {techOptions.length === 0 && (
                                                        <MenuItem disabled value="">
                                                            (Aucun technicien disponible)
                                                        </MenuItem>
                                                    )}
                                                </Select>

                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleValidateAssign(a.id)}
                                                    disabled={techOptions.length === 0}
                                                >
                                                    Valider
                                                </Button>
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                Services : {a.serviceDTOS?.map((s) => s.name).join(", ") || "Aucun service"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}
            </Container>

            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} fullScreen={false}>
                <DialogTitle>Modifier le(s) technicien(s)</DialogTitle>
                <DialogContent dividers>
                    {selectedEvent && (
                        <Box mb={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Client : {selectedEvent.customerName} {selectedEvent.customerSurname}
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

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={1}>
                                <Typography variant="body2">Début : {new Date(selectedEvent.start).toLocaleString("fr-FR")}</Typography>
                                <Typography variant="body2">Fin : {new Date(selectedEvent.end).toLocaleString("fr-FR")}</Typography>
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Technicien(s) actuel(s) : {selectedEvent.techNames.join(", ") || "Non assigné"}
                            </Typography>

                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={techOptions}
                                value={techOptions.filter((o) => selectedTechsEvent.includes(o.id))}
                                onChange={(_, newValue) => setSelectedTechsEvent(newValue.map((o) => o.id))}
                                getOptionLabel={(opt) => opt.label}
                                isOptionEqualToValue={(a, b) => a.id === b.id}
                                renderInput={(params) => <TextField {...params} placeholder="Choisir des techniciens…" size="small" fullWidth />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.id}>
                                        <Checkbox sx={{ mr: 1 }} checked={selected} />
                                        <Avatar sx={{ width: 24, height: 24, bgcolor: option.color, mr: 1, fontSize: 12 }}>
                                            {option.label.slice(0, 1).toUpperCase()}
                                        </Avatar>
                                        <Typography>{option.label}</Typography>
                                    </li>
                                )}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
                    <Button onClick={() => setSelectedEvent(null)}>Annuler</Button>
                    <Button variant="contained" onClick={handleSaveEventTechs} disabled={techOptions.length === 0}>
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </>
    );
};

export default GarageCalendar;
