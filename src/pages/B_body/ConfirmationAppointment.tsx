import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import HeroTitle from "../../components/common/HeroTitle";
import { Box, Card, CardContent, Stack, Typography, Chip, Button, Divider } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { Link as RouterLink, useLocation } from "react-router";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");


const SERVICE_LABELS: Record<number, string> = {
    1: "Vidange + Filtre à Huile",
    2: "Pneumatiques",
    3: "Freins",
    4: "Batterie",
    5: "Distribution",
    6: "Amortisseurs",
    7: "Climatisation",
    8: "Diagnostic électronique",
    9: "Géométrie / Parallélisme",
    10: "Filtres air & habitacle",
    11: "Bougies / Préchauffage",
    12: "Embrayage",
};


type SelectionLike = {
    appointment?: { start: string; end: string };
    start?: string;
    end?: string;
    id?: number;
    name?: string;
    codePostal?: string;
    libelleCommune?: string;
    immat?: string;
    make?: string;
    model?: string;
    year?: number;
    services?: number[];
};

const fmt = (iso?: string) => (iso ? dayjs(iso).format("dddd D MMM YYYY • HH:mm") : "—");

const ConfirmationAppointment = () => {
    const location = useLocation() as { state?: any };

    let data: SelectionLike | null =
        location?.state?.confirmation ?? location?.state?.selection ?? null;


    if (!data) {
        try {
            const saved = localStorage.getItem("ac.selection");
            if (saved) data = JSON.parse(saved);
        } catch {}
    }

    const start = data?.appointment?.start ?? data?.start;
    const end = data?.appointment?.end ?? data?.end;
    const services = data?.services ?? [];
    const cityLine = [data?.codePostal, data?.libelleCommune].filter(Boolean).join(" ");

    const clearAppointmentStorage = () => {
        try {
            localStorage.removeItem("ac.selection");
            localStorage.removeItem("ac.account");

        } catch {}
    };

    return (
        <>
            <Header />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />

            <Typography variant="h5" align="center" sx={{ mt: 3, fontWeight: 700, color: "success.main" }}>
                ✅ Rendez-vous confirmé
            </Typography>

            <Box
                component="img"
                src="/public/garagisteHappy.jpg"
                alt="Garagiste souriant"
                sx={{
                    display: "block",
                    mx: "auto",
                    mt: 2,
                    width: "100%",
                    maxWidth: 900,
                    height: "auto",
                    borderRadius: 2,
                    objectFit: "cover",
                    boxShadow: 1,
                }}
            />

            <Card sx={{ maxWidth: 720, mx: "auto", my: 3, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Stack spacing={2}>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EventAvailableIcon />
                            <Typography variant="subtitle1" fontWeight={700}>
                                {fmt(start)} → {fmt(end)}
                            </Typography>
                        </Stack>

                        <Divider />

                        <Stack spacing={0.5}>
                            <Typography variant="overline" sx={{ opacity: 0.8 }}>
                                Garage
                            </Typography>
                            <Typography variant="h6">{data?.name ?? `Garage #${data?.id ?? ""}`.trim()}</Typography>
                            {cityLine && (
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {cityLine}
                                </Typography>
                            )}
                        </Stack>

                        <Divider />

                        <Stack spacing={0.5}>
                            <Typography variant="overline" sx={{ opacity: 0.8 }}>
                                Véhicule
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <DirectionsCarFilledIcon />
                                <Typography>
                                    <strong>
                                        {(data?.make ?? "")} {(data?.model ?? "")} {data?.year ? `• ${data.year}` : ""}
                                    </strong>
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {data?.immat ? `Immat : ${data.immat.toUpperCase()}` : "Immat : —"}
                            </Typography>
                        </Stack>

                        {services.length > 0 && (
                            <>
                                <Divider />
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {services.map((s) => (
                                        <Chip key={s} label={SERVICE_LABELS[s] ?? `Service #${s}`} />
                                    ))}
                                </Stack>
                            </>
                        )}

                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 1 }}>
                            <Button
                                component={RouterLink}
                                to="/"
                                variant="contained"
                                onClick={clearAppointmentStorage}
                            >
                                Accueil
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Footer />
        </>
    );
};

export default ConfirmationAppointment;
