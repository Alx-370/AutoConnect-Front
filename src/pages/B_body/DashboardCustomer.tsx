import { useEffect, useMemo, useState } from "react";
import HeaderWithLogout from "../A_header/HeaderWithLogout";
import Footer from "../C_footer/Footer";
import {Box, Card, CardContent, CardHeader, Typography, CircularProgress, Alert, Stack, Chip, Avatar, Button, Divider, Grid} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ScheduleIcon from "@mui/icons-material/Schedule";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router";
import { getCars, getAppointments, type CarDTO, type AppointmentDTO } from "../../api/axiosCustomer";
import HeroTitle from "../../components/common/HeroTitle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SpeedIcon from "@mui/icons-material/Speed";

dayjs.locale("fr");

const fmtDate = (iso?: string) => (iso ? dayjs(iso).format("dddd D MMM YYYY") : "—");
const fmtTime = (iso?: string) => (iso ? dayjs(iso).format("HH:mm") : "—");
const isFuture = (iso?: string) => (iso ? dayjs(iso).isAfter(dayjs()) : false);

const DashboardCustomer = () => {
    const [cars, setCars] = useState<CarDTO[] | null>(null);
    const [apts, setApts] = useState<AppointmentDTO[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("ac.account");
        if (!token) {
            navigate("/login-user-customer", { replace: true });
            return;
        }

        let mounted = true;
        (async () => {
            try {
                const [carsRes, aptsRes] = await Promise.all([getCars(token), getAppointments(token)]);
                if (!mounted) return;
                setCars(carsRes);
                setApts(aptsRes);
            } catch (e) {
                if (axios.isAxiosError(e) && e.response?.status === 401) {
                    navigate("/login-user-customer", { replace: true });
                    return;
                }
                if (!mounted) return;
                setErr("Impossible de récupérer vos données. Vérifiez votre connexion ou votre session.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [navigate]);


    const nextApt = useMemo(() => {
        const list = (apts ?? []).filter(a => a.start && isFuture(a.start));
        return list.sort((a, b) => dayjs(a.start!).valueOf() - dayjs(b.start!).valueOf())[0];
    }, [apts]);

    return (
        <>
            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />

            <Box sx={{ maxWidth: 1100, mx: "auto", p: 2, my: 3 }}>
                {loading && (
                    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {err && <Alert severity="error">{err}</Alert>}

                {!loading && !err && (
                    <Stack spacing={3}>

                        {nextApt ? (
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    background: "linear-gradient(135deg, rgba(33,150,243,0.10), rgba(25,118,210,0.10))",
                                }}
                            >
                                <CardHeader
                                    avatar={<Avatar sx={{ bgcolor: "primary.main" }}><EventAvailableIcon /></Avatar>}
                                    title={<Typography variant="h6" fontWeight={800}>Prochain rendez-vous</Typography>}
                                    subheader={
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                            <ScheduleIcon fontSize="small" />
                                            <Typography variant="body2">
                                                {fmtDate(nextApt.start)} • {fmtTime(nextApt.start)} → {fmtTime(nextApt.end)}
                                            </Typography>
                                            {dayjs(nextApt.start).isSame(dayjs(), "day") && (
                                                <Chip label="Aujourd'hui" size="small" color="success" sx={{ ml: 1 }} />
                                            )}
                                        </Stack>
                                    }
                                />
                                <CardContent sx={{ pt: 0 }}>

                                    {nextApt.garageName && (
                                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                            {nextApt.garageName}
                                        </Typography>
                                    )}
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                        {(nextApt.services ?? []).map((s, i) => (
                                            <Chip key={`${s}-${i}`} label={`Service #${s}`} size="small" variant="outlined" />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                                <CardContent>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack spacing={0.5}>
                                            <Typography variant="h6" fontWeight={700}>Aucun rendez-vous à venir</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Planifiez votre prochaine intervention en quelques clics.
                                            </Typography>
                                        </Stack>
                                        <Button
                                            component={RouterLink}
                                            to="/search-garage"
                                            variant="contained"
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            Prendre un rendez-vous
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}


                        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: "secondary.main" }}><DirectionsCarFilledIcon /></Avatar>}
                                title={<Typography variant="h6" fontWeight={800}>Mes véhicules</Typography>}
                                action={
                                    <Button
                                        size="small"
                                        startIcon={<AddCircleOutlineIcon />}
                                        variant="outlined"
                                        sx={{ textTransform: "none", borderRadius: 2 }}
                                        // to="/ajouter-vehicule"
                                        // component={RouterLink}
                                    >
                                        Ajouter un véhicule
                                    </Button>
                                }
                            />
                            <CardContent sx={{ pt: 0 }}>
                                {cars?.length ? (
                                    <Grid container spacing={2}>
                                        {cars.map((c, i) => (
                                            <Grid key={c.id ?? i} item xs={12} sm={6} md={4}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        height: "100%",
                                                        transition: "transform .15s ease, box-shadow .15s ease",
                                                        "&:hover": { transform: "translateY(-2px)", boxShadow: 4, borderColor: "primary.main" },
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{ bgcolor: "secondary.main" }}>
                                                                <DirectionsCarFilledIcon />
                                                            </Avatar>

                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography fontWeight={800} noWrap>
                                                                    {`${c.make ?? ""} ${c.model ?? ""}`.trim() || "Véhicule"}
                                                                    {c.year ? ` • ${c.year}` : ""}
                                                                </Typography>

                                                                <Stack direction="row" spacing={1} sx={{ mt: 0.75 }} flexWrap="wrap">
                                                                    {c.immat && (
                                                                        <Chip
                                                                            size="small"
                                                                            label={c.immat.toUpperCase()}
                                                                            sx={{
                                                                                fontFamily: "monospace",
                                                                                letterSpacing: "0.6px",
                                                                                bgcolor: (t) => t.palette.grey[900],
                                                                                color: "white",
                                                                                borderRadius: 1,
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {c.km != null && (
                                                                        <Chip
                                                                            size="small"
                                                                            icon={<SpeedIcon fontSize="small" />}
                                                                            label={`${c.km} km`}
                                                                            variant="outlined"
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            </Box>
                                                        </Stack>

                                                        <Divider sx={{ my: 1.5 }} />

                                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                            <Button
                                                                size="small"
                                                                variant="text"
                                                                sx={{ textTransform: "none" }}
                                                                component={RouterLink}
                                                                to="/search-garage"
                                                            >
                                                                Prendre rendez-vous
                                                            </Button>
                                                            {/* Bouton placeholder si tu ajoutes une page détails véhicule */}
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ textTransform: "none", borderRadius: 2 }}
                                                                disabled
                                                            >
                                                                Détails
                                                            </Button>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Stack alignItems="center" spacing={1.5} sx={{ py: 3 }}>
                                        <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56 }}>
                                            <DirectionsCarFilledIcon />
                                        </Avatar>
                                        <Typography sx={{ opacity: 0.85 }}>Aucun véhicule trouvé.</Typography>
                                        <Button
                                            startIcon={<AddCircleOutlineIcon />}
                                            variant="contained"
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                            // to="/ajouter-vehicule"
                                            // component={RouterLink}
                                        >
                                            Ajouter mon premier véhicule
                                        </Button>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>

                        <Divider sx={{ my: 1 }} />
                    </Stack>
                )}
            </Box>

            <Footer />
        </>
    );
};

export default DashboardCustomer;