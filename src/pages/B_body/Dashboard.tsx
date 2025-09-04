import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import {Box, Button, TextField} from "@mui/material";
import CarSearch from "../../components/CarSearch.tsx";


import PrestationListContainer from "../../components/PrestationListContainer.tsx";



const Dashboard = () => {
    return (
        <>
            <Header />
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <h1
                style={{
                    padding: 16,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                AutoConnect
            </h1>

            <p
                style={{
                    padding: 16,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                La tranquillité commence ici : comparez les meilleurs garages de votre
                région et optez pour celui qui correspond le mieux à vos attentes.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
                <TextField
                    sx={{ width: 180 }}
                    id="outlined-basic"
                    label="Immatriculation"
                    variant="outlined"
                />
                <TextField
                    sx={{ width: 180 }}
                    id="outlined-basic2"
                    label="Kilométrage"
                    variant="outlined"
                />
            </div>

            <CarSearch />
            <PrestationListContainer />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{
                        mt: 5,
                        width: 300,
                        px: 3,
                        py: 1.25,
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: "none",

                        border: "2px solid transparent",
                        background:
                            "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg,#1976d2,#2196f3) border-box",

                        color: "primary.main",
                        boxShadow: "0 6px 16px rgba(33,150,243,.18)",

                        "&:hover": {
                            background:
                                "linear-gradient(#f6f9ff,#f6f9ff) padding-box, linear-gradient(90deg,#1565c0,#1e88e5) border-box",
                            boxShadow: "0 8px 22px rgba(21,101,192,.28)",
                        },
                        "&:active": { transform: "translateY(1px)" },
                    }}
                >
                    Enregistrer ma sélection
                </Button>
                </div>
            </Box>
            <Footer />
        </>
    );
};

export default Dashboard;
