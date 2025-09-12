import React from "react";
import {AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BuildIcon from "@mui/icons-material/Build";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router";

const Header = () => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    return (
        <AppBar
            position="static"
            color="primary"
            sx={{ boxShadow: 2, background: "linear-gradient(90deg,#1976d2,#2196f3)" }}
        >
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                <Box
                    component={RouterLink}
                    to="/"
                    aria-label="Aller à l'accueil AutoConnect"
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button
                            size="medium"
                            variant="outlined"
                            color="inherit"
                            startIcon={<BuildIcon />}
                            sx={{ borderColor: "white", color: "white", "&:hover": { borderColor: "white" }, textTransform: "none" }}
                        >
                            Garagiste
                        </Button>
                        <Button
                            size="medium"
                            variant="contained"
                            color="secondary"
                            startIcon={<PersonOutlineIcon />}
                            sx={{ fontWeight: 700, color: "white", textTransform: "none", background: "#0d47a1", "&:hover": { background: "#08306b" } }}
                        >
                            Automobiliste
                        </Button>
                    </Box>
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
                            <MenuItem onClick={closeMenu}>
                                <BuildIcon fontSize="small" style={{ marginRight: 8 }} />
                                Garagiste
                            </MenuItem>
                            <MenuItem onClick={closeMenu}>
                                <PersonOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
                                Automobiliste
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
