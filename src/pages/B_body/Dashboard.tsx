import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import {Box, Button, TextField} from "@mui/material";
import CarSearch from "../../components/CarSearch.tsx";
import PrestationListContainer from "../../components/PrestationListContainer.tsx";
import {useState} from "react";
import BookingSteps from "../../components/BookingSteps.tsx";
import {useNavigate} from "react-router";



const Dashboard = () => {

    const navigate = useNavigate();

    const [immat, setImmat] = useState("");
    const [km, setKm]       = useState("");
    const [carSel, setCarSel] = useState<{ make: string|null; model: string|null; year: string|number|null }>
    ({
        make: null, model: null, year: null,
    });

    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number | string>>(new Set());

    const toggleService = (id: number | string) => {
        setSelectedServiceIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };


    const handleSave = () => {
        const payload = {
            immat,
            km,
            make: carSel.make,
            model: carSel.model,
            year: carSel.year,
            services: Array.from(selectedServiceIds),
        };
        localStorage.setItem("ac.selection", JSON.stringify(payload));
        console.log("saved:", payload);
        navigate("/SearchGarage");
    };

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
                <BookingSteps />

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
                <TextField
                    sx={{ width: 180, ml:1 }}
                    id="outlined-basic"
                    label="Immatriculation"
                    variant="outlined"
                    value={immat}
                    onChange={(e) => setImmat(e.target.value)}
                />
                <TextField
                    sx={{ width: 180, mr:1 }}
                    id="outlined-basic2"
                    label="Kilométrage"
                    variant="outlined"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                />
            </div>

            <CarSearch onChangeCar={setCarSel} />
            <PrestationListContainer  selectedIds={selectedServiceIds}
                                      onToggleId={toggleService}/>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            mt: 2,
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            boxShadow: 2,
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
