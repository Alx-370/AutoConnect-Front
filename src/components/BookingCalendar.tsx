import { useMemo, useState } from "react";
import {Card, CardHeader, CardContent, Divider, Stack, Box, Button, Typography, GlobalStyles, useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
    const [selectedStart, setSelectedStart] = useState<string | null>(null);

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
                "@media print": { "#print-calendar": { display: "none !important" } },
            }} />

            <div id="print-calendar">
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: 640, md: 720 },
                        mt: { xs: 2, sm: 4 },
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
                                <Typography variant="h6" fontWeight={800}>Prendre rendez-vous</Typography>
                            </Stack>
                        }
                        subheader={<Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>{subtitle}</Typography>}
                        sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                    />

                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Stack spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: "100%",
                                    overflowX: { xs: "auto", sm: "visible" },
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                    <DateCalendar
                                        value={date}
                                        onChange={(d) => { setDate(d); setSelectedStart(null); }}
                                        sx={{

                                            "& .MuiPickersSlideTransition-root": { minHeight: { xs: 280, sm: 320 } },
                                            "& .MuiDayCalendar-header, & .MuiDayCalendar-weekDayLabel": { mx: { xs: 0.5, sm: 1 } },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Divider sx={{ width: "100%", my: 1.5 }} />

                            <Typography variant="subtitle1" fontWeight={700}>Créneaux disponibles</Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: { xs: 520, sm: 680 },
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(2, 1fr)",
                                        sm: "repeat(3, 1fr)",
                                        md: "repeat(4, 1fr)",
                                    },
                                    gap: { xs: 1, sm: 1.25 },
                                }}
                            >
                                {slots.map((s) => {
                                    const start = dayjs(s.start);
                                    const label = start.format("HH:mm");
                                    const disabled = isDisabled(s.start);
                                    const selected = selectedStart === s.start;
                                    return (
                                        <Button
                                            key={s.start}
                                            variant={selected ? "contained" : "outlined"}
                                            disabled={disabled}
                                            onClick={() => { setSelectedStart(s.start); onPick(s); }}
                                            size={isXs ? "small" : "medium"}
                                            sx={{
                                                textTransform: "none",
                                                minHeight: 40,
                                            }}
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
