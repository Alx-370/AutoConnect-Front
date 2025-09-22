import { AppBar, Toolbar, Button, Box } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link as RouterLink } from "react-router";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";



const NavbarEngineer = () => {
    return (
        <AppBar position="static" sx={{ background: GRADIENT, boxShadow: 2, mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                <Box sx={{ flexGrow: 1 }} />

                <Button
                    color="inherit"
                    variant="outlined"
                    startIcon={<DashboardIcon />}
                    component={RouterLink}
                    to="/dashboard-engineer"
                    sx={{
                        textTransform: "none",
                        borderColor: "white",
                        color: "white",
                        "&:hover": { borderColor: "white" },
                    }}
                >
                    Dashboard
                </Button>

                <Button
                    color="inherit"
                    variant="outlined"
                    startIcon={<EventNoteIcon />}
                    component={RouterLink}
                    to="/garage-calendar"
                    sx={{
                        textTransform: "none",
                        borderColor: "white",
                        color: "white",
                        ml: 1,
                        "&:hover": { borderColor: "white" },
                    }}
                >
                    Agenda
                </Button>

                <Button
                    color="inherit"
                    variant="contained"
                    startIcon={<SettingsIcon />}
                    component={RouterLink}
                    to="/engineer/gestion"
                    sx={{
                        textTransform: "none",
                        ml: 1,
                        background: "#0d47a1",
                        "&:hover": { background: "#08306b" },
                    }}
                >
                    Gestion
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavbarEngineer;
