import { AppBar, Toolbar, Button, Paper, Container, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link as RouterLink, useLocation } from "react-router";

const NavbarEngineer = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", mt: 2 }}>
            <Toolbar sx={{ justifyContent: "center" }}>
                <Container maxWidth="md">
                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 50,
                            backgroundColor: "background.paper",
                            px: { xs: 1, sm: 2 },
                            py: { xs: 0.5, sm: 1 },
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: { xs: 0.5, sm: 1 },
                                flexWrap: "nowrap",
                                width: "100%",
                            }}
                        >
                            <Button
                                component={RouterLink}
                                to="/dashboard-engineer"
                                startIcon={<DashboardIcon fontSize="small" />}
                                variant={isActive("/dashboard-engineer") ? "contained" : "text"}
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 0,
                                    px: { xs: 1, sm: 2 },
                                    fontSize: { xs: 12, sm: 14 },
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Dashboard
                            </Button>

                            <Button
                                component={RouterLink}
                                to="/garage-calendar"
                                startIcon={<EventNoteIcon fontSize="small" />}
                                variant={isActive("/garage-calendar") ? "contained" : "text"}
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 0,
                                    px: { xs: 1, sm: 2 },
                                    fontSize: { xs: 12, sm: 14 },
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Agenda
                            </Button>

                            <Button
                                component={RouterLink}
                                to="/management-engineer"
                                startIcon={<SettingsIcon fontSize="small" />}
                                variant={isActive("/management-engineer") ? "contained" : "text"}
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    minWidth: 0,
                                    px: { xs: 1, sm: 2 },
                                    fontSize: { xs: 12, sm: 14 },
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Gestion
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

export default NavbarEngineer;
