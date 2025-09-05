// src/components/BookingSteps.tsx
import { Box, Card, CardContent, Stack, Avatar, Typography } from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

type StepDef = {
    title: string;
    desc: string;
    Icon: typeof DirectionsCarFilledIcon;
};

const STEPS: StepDef[] = [
    {
        title: "1) Infos véhicule",
        desc: "Marque, modèle, année et immatriculation.",
        Icon: DirectionsCarFilledIcon,
    },
    {
        title: "2) Choisir un garage",
        desc: "Comparez les garages et leurs avis.",
        Icon: StorefrontIcon,
    },
    {
        title: "3) Sélectionner une date",
        desc: "Choisissez le créneau qui vous arrange.",
        Icon: CalendarMonthIcon,
    },
    {
        title: "4) S’identifier",
        desc: "Créez un compte ou connectez-vous.",
        Icon: PersonIcon,
    },
];

const BookingSteps = () => {
    return (
        <Box
            sx={{
                mt: 4,
                px: 2,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
            }}
        >
            {STEPS.map(({ title, desc, Icon }) => (
                <Card
                    key={title}
                    variant="outlined"
                    sx={{
                        flex: "1 1 240px",
                        maxWidth: 320,
                        transition: "transform .15s ease, box-shadow .15s ease",
                        ":hover": { transform: "translateY(-2px)", boxShadow: 3 },
                    }}
                >
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                <Icon />
                            </Avatar>
                            <Typography variant="subtitle1">{title}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {desc}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default BookingSteps;
