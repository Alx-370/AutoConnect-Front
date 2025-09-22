import React, { useState } from "react";
import {AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router";

type HeaderWithLogoutProps = {
    onLogout?: () => void;
};

const HeaderWithLogout = ({ onLogout }: HeaderWithLogoutProps) => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const handleLogout = () => {
        try {
            onLogout?.();
        } finally {

            localStorage.removeItem("ac.account");
            navigate("/", { replace: true });
        }
    };

    return (
        <AppBar
            position="static"
            color="primary"
            sx={{ boxShadow: 2, background: "linear-gradient(90deg,#1976d2,#2196f3)" }}
        >
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { opacity: 0.9 },
                    }}
                >
                    <DirectionsCarFilledIcon fontSize={isMdUp ? "large" : "medium"} />
                    <Typography
                        variant={isMdUp ? "h6" : "subtitle1"}
                        sx={{ fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}
                    >
                        AutoConnect
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {isMdUp ? (
                    <Button
                        size="medium"
                        variant="outlined"
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ borderColor: "white", color: "white", textTransform: "none" }}
                    >
                        Se déconnecter
                    </Button>
                ) : (
                    <>
                        <IconButton color="inherit" aria-label="menu" onClick={openMenu} sx={{ color: "white" }}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={closeMenu}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem
                                onClick={() => {
                                    closeMenu();
                                    handleLogout();
                                }}
                            >
                                <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                                Se déconnecter
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default HeaderWithLogout;