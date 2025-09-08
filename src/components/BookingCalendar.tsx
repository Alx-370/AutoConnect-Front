import { useMemo, useState } from "react";
import {Card, CardHeader, CardContent, Divider, Stack, Box, Button, Typography, GlobalStyles} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

export type Slot = { start: string; end: string };

type Props = {
    onPick?: (slot: Slot) => void;
    startHour?: number;
    endHour?: number;
    stepMin?: number;
    disabledTimes?: string[];
};

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const BookingCalendar = ({
                             onPick = () => {},
                             startHour = 9,
                             endHour = 18,
                             stepMin = 30,
                             disabledTimes = [],
                         }: Props) => {
    const [date, setDate] = useState<Dayjs | null>(dayjs());

    const slots = useMemo(() => {
        if (!date) return [];
        const d = date.startOf("day");
        const out: Slot[] = [];
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += stepMin) {
                const start = d.hour(h).minute(m);
                const end = start.add(stepMin, "minute");
                out.push({ start: start.toISOString(), end: end.toISOString() });
            }
        }
        return out;
    }, [date, startHour, endHour, stepMin]);

    const isDisabled = (isoStart: string) =>
        disabledTimes.includes(isoStart) || dayjs(isoStart).isBefore(dayjs());

    const subtitle = date
        ? date.format("dddd D MMMM YYYY").replace(/^\w/, (c) => c.toUpperCase())
        : "";

    return (
        <>
            <GlobalStyles styles={{
                "@media print": {
                    "#print-calendar": { display: "none !important" },
                },
            }} />

            <div id="print-calendar">
                <Card
                    sx={{
                        maxWidth: 920,
                        mt: 5,
                        mx: "auto",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 10px 28px rgba(0,0,0,.10)",
                    }}
                >
                    <CardHeader
                        avatar={<EventAvailableIcon sx={{ color: "white" }} />}
                        title={
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={800}>
                                    Prendre rendez-vous
                                </Typography>
                            </Stack>
                        }
                        subheader={
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>
                                {subtitle}
                            </Typography>
                        }
                        sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                    />

                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2} alignItems="center">
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                <DateCalendar value={date} onChange={setDate} />
                            </LocalizationProvider>

                            <Divider sx={{ width: "100%", my: 1.5 }} />

                            <Typography variant="subtitle1" fontWeight={700}>
                                Créneaux disponibles
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                                    gap: 1,
                                    width: "100%",
                                    maxWidth: 680,
                                }}
                            >
                                {slots.map((s) => {
                                    const start = dayjs(s.start);
                                    const label = start.format("HH:mm");
                                    const disabled = isDisabled(s.start);
                                    return (
                                        <Button
                                            key={s.start}
                                            variant="outlined"
                                            disabled={disabled}
                                            onClick={() => onPick(s)}
                                            sx={{ textTransform: "none" }}
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </Box>

                            {slots.length === 0 && (
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Aucun créneau ce jour.
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default BookingCalendar;
