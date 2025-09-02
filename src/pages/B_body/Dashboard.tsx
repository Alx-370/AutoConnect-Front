import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import { TextField } from "@mui/material";
import CarSearch from "../../components/CarSearch.tsx";


const Dashboard = () => {
    return (
        <>
            <Header />

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

            {/* 🔎 Recherche de véhicule */}
            <CarSearch />

            <Footer />
        </>
    );
};

export default Dashboard;
