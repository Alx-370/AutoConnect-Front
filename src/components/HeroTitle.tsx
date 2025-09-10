import { Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import type { ReactNode } from "react";

type HeroTitleProps = {
    title: string;
    subtitle?: ReactNode;
    gradient?: string;
    center?: boolean;
    showIcon?: boolean;
    sx?: SxProps<Theme>;
};

const DEFAULT_GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const HeroTitle = ({
                       title,
                       subtitle,
                       gradient = DEFAULT_GRADIENT,
                       center = true,
                       showIcon = true,
                       sx,
                   }: HeroTitleProps) => {
    return (
        <Stack alignItems={center ? "center" : "flex-start"} spacing={1.25} sx={sx}>
            <Stack direction="row" alignItems="center" spacing={1}>
                {showIcon && (
                    <DirectionsCarFilledIcon
                        sx={{
                            fontSize: 36,
                            color: "primary.main",
                            filter: "drop-shadow(0 2px 6px rgba(25,118,210,.35))",
                        }}
                    />
                )}
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: 28, sm: 36, md: 42 },
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        lineHeight: 1.1,
                        m: 0,
                        px: 1,
                        backgroundImage: gradient,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                        position: "relative",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 8,
                            right: 8,
                            bottom: -6,
                            height: 4,
                            borderRadius: 2,
                            background: gradient,
                            opacity: 0.85,
                        },
                    }}
                >
                    {title}
                </Typography>
            </Stack>

            {subtitle &&
                (typeof subtitle === "string" ? (
                    <Typography variant="body2" sx={{ opacity: 0.8, textAlign: center ? "center" : "left" }}>
                        {subtitle}
                    </Typography>
                ) : (
                    subtitle
                ))}
        </Stack>
    );
};

export default HeroTitle;
