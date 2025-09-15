import { styled } from "@mui/material/styles";
import {Box, Stack, Stepper, Step, StepLabel, Typography, useMediaQuery, useTheme,} from "@mui/material";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import type { StepIconProps } from "@mui/material/StepIcon";

import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const steps = [
    { title: "Infos véhicule", desc: "Marque, modèle, année & immat.", Icon: DirectionsCarFilledIcon },
    { title: "Choisir un garage", desc: "Comparez tarifs et avis.", Icon: StorefrontIcon },
    { title: "Sélectionner une date", desc: "Choisissez votre créneau.", Icon: CalendarMonthIcon },
    { title: "S’identifier", desc: "Connexion ou création de compte.", Icon: PersonIcon },
] as const;


const BlueGradientConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 28,
        [theme.breakpoints.down("sm")]: { top: 22 },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 4,
        border: 0,
        borderRadius: 2,
        backgroundColor: theme.palette.divider,
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line},
    &.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
        backgroundImage: GRADIENT,
    },
}));


const StepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState, theme }) => ({
    position: "relative",
    width: 56,
    height: 56,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    background: "#cfd8dc",
    transition: "transform .2s ease, box-shadow .2s ease, background .2s ease",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.06)",
    [theme.breakpoints.down("sm")]: { width: 46, height: 46 },
    ...(ownerState.active && {
        background: GRADIENT,
        boxShadow: "0 8px 22px rgba(25,118,210,.35)",
        transform: "translateY(-1px) scale(1.02)",
    }),
    ...(ownerState.completed && { background: GRADIENT }),
    "::after": {
        content: '""',
        position: "absolute",
        inset: -4,
        borderRadius: "inherit",
        boxShadow: ownerState.active ? "0 0 0 4px rgba(25,118,210,.12)" : "none",
        transition: "box-shadow .2s ease",
    },
}));

function BookingStepIcon(props: StepIconProps) {
    const { active, completed, className, icon } = props;
    const map = {
        1: <DirectionsCarFilledIcon />,
        2: <StorefrontIcon />,
        3: <CalendarMonthIcon />,
        4: <PersonIcon />,
    } as const;

    return (
        <StepIconRoot ownerState={{ active, completed }} className={className}>
            {map[Number(icon) as 1 | 2 | 3 | 4]}
        </StepIconRoot>
    );
}

export type BookingStepsProps = {

    activeStep?: number;
};

export default function BookingSteps({ activeStep = 0 }: BookingStepsProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const orientation: "horizontal" | "vertical" = isXs ? "vertical" : "horizontal";

    return (
        <Box sx={{ width: "100%", mt: 3, px: { xs: 1.5, sm: 2 } }}>
            <Box
                sx={{
                    mx: "auto",
                    maxWidth: 1150,
                    p: { xs: 1.5, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "rgba(172,172,172,.06)",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
                    backdropFilter: "saturate(1.1) blur(2px)",
                }}
            >
                <Stepper
                    orientation={orientation}
                    alternativeLabel={!isXs}
                    activeStep={activeStep}
                    connector={!isXs ? <BlueGradientConnector /> : undefined}
                >
                    {steps.map(({ title, desc }) => (
                        <Step key={title}>
                            <StepLabel
                                slots={{ stepIcon: BookingStepIcon }}
                                sx={{
                                    ".MuiStepLabel-label": { mt: { xs: 0.75, sm: 1 } },
                                }}
                            >
                                <Stack
                                    spacing={0.25}
                                    alignItems={isXs ? "flex-start" : "center"}
                                    textAlign={isXs ? "left" : "center"}
                                >
                                    <Typography
                                        variant={isXs ? "subtitle2" : "subtitle1"}
                                        fontWeight={700}
                                        sx={{ letterSpacing: 0.2 }}
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ maxWidth: isXs ? "100%" : 180 }}
                                    >
                                        {desc}
                                    </Typography>
                                </Stack>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Box>
    );
}