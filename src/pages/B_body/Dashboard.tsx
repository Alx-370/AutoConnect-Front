import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import {Box, Button} from "@mui/material";
import CarSearch from "../../components/CarSearch";
import PrestationListContainer from "../../components/PrestationListContainer";
import BookingSteps from "../../components/BookingSteps";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import HeroTitle from "../../components/HeroTitle.tsx";


const Dashboard = () => {
    const navigate = useNavigate();

    const [immat, setImmat] = useState("");
    const [km, setKm] = useState("");
    const [carSel, setCarSel] = useState<{
        make: string | null;
        model: string | null;
        year: string | number | null;
    }>({ make: null, model: null, year: null });

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

    const canContinue = useMemo(() => {
        const hasService = selectedServiceIds.size > 0;
        return (
            immat.trim().length > 0 &&
            km.trim().length > 0 &&
            !!carSel.make &&
            !!carSel.model &&
            carSel.year !== null &&
            carSel.year !== "" &&
            hasService
        );
    }, [immat, km, carSel, selectedServiceIds]);

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
        navigate("/search-garage");
    };

    return (
        <>
            <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <HeroTitle
                title="AutoConnect"
                sx={{ mt: 3 }}
            />

                <p style={{ padding: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    La tranquillité commence ici : comparez les meilleurs garages de votre région et optez
                    pour celui qui correspond le mieux à vos attentes.
                </p>

                <BookingSteps activeStep={0} />

                <CarSearch
                    immat={immat}
                    km={km}
                    onChangeImmat={setImmat}
                    onChangeKm={setKm}
                    onChangeCar={setCarSel}
                />

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!canContinue}
                        sx={{ mt: 2, px: 3, py: 1, borderRadius: 2, textTransform: "none", boxShadow: 2 }}
                    >
                        Enregistrer mes informations
                    </Button>
                </div>

                <PrestationListContainer
                    selectedIds={selectedServiceIds}
                    onToggleId={toggleService}
                />
            </Box>
            <Footer />
        </>
    );
};

export default Dashboard;
